var app = getApp();
//showToast

wx.showMyToast = function(obj){
  if (!obj.title) {
    throw "title error"
  }
  obj.icon = obj.icon || 'none'
  obj.duration = obj.duration || 3000

  setTimeout(() => {
    wx.showToast({
      title: obj.title,
      icon: obj.icon,
      duration: obj.duration
    });
    setTimeout(() => {
      wx.hideToast();
    }, 3000)
  }, 0);
}


//存储user_id
const setUserID = user_id => {
  wx.setStorageSync('user_id', user_id);
}

const getUserID = () => {
  return wx.getStorageSync('user_id');
}
/**
 * 设置和获取当前页面的导航栏颜色
 */
const setNavigationBarColor = () => {
  var navigationBarColor = wx.getStorageSync('navigationBarColor');
  if (navigationBarColor) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: navigationBarColor
    })
  } else {
    wx.setStorageSync('navigationBarColor', '#1d7f0a');
  }
};
const getNavigationBarColor = () => {
  var navigationBarColor = wx.getStorageSync('navigationBarColor');
  return navigationBarColor;
};

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 将jokes数组的对象的publishTime属性值（为时间戳字符串）转换为
 * xxxx-xx-xx xx:xx
 */
const jokesConvertTime = jokes => {
  if (!jokes) return;
  return jokes.map(function(e) {
    var date = new Date(e.publishTime);
    e.publishTime = formatTime(date);;
    return e;
  });
};

//适应所有请求
wx.myRequest = function(obj) {
  obj.complete = obj.complete || function() {};
  obj.fail = obj.fail || function() {
    wx.showToast({
      title: '服务器响应错误~',
      icon: 'none'
    })
  };
  wx.showLoading({
    title: '加载中...'
  })
  var token = wx.getStorageSync('token');
  console.log('token:', token);
  wx.request({
    url: obj.url,
    data: obj.data,
    method: obj.method,
    header: {
      token: token
    },
    success: function(res) {
      wx.setStorageSync('token', res.header.token)
      obj.success(res);
    },
    fail: function() {
      obj.fail();
    },
    complete: function() {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      obj.complete();
    }
  })
};
/**
 * 职责：jokeList专属的网络请求,具有本地缓存效果
 * 例子：
 * var util=require('');
 * var res=util.request.getData({
 *    host:'',
 *    params:{},
 *    method:'GET',
 *    success:function(res){
 *      console.log(res);
 *    },
 *    fail:function(){},
 *    complete:function(){},
 * });
 * 
 * 回调的数据格式
 * res={
 *    code:0, 
 *    msg:'',
 *    data:[{
 *      _id:'asdfasdf_sdf_fad',
 *      publishTime:'2018-7-10 20:42'
 *    }]
 * }
 * 
 * 注意：
 * 由于获取本地缓存是根据 host 和 params 字符串匹配获取的
 * 若一个参数的不同值 表示的都是同一类缓存记录，
 * 则需通过 setIgnoreParams(Array) Array=['key1','key2',...] 来设置ignoreParams
 * 
 */
//抽象程度：只要知道对象的职责和接口，其他的隐藏
const request = {
  ignoreParams: [],
  dataHandler: function(data) { //响应的对象
    var users = data.data;
    var arr = [];
    for (var i = 0; i < users.length; i++) {
      var user = users[i];
      var r = user.jokes;
      for (var j = 0; j < r.length; j++) {
        var joke = r[j];
        joke.uid = user.uid;
        joke.nickName = user.nickName;
        joke.gender = user.gender;
        joke.city = user.city;
        joke.province = user.province;
        joke.country = user.country;
        joke.avatarUrl = user.avatarUrl;
        joke.isFavorite = false;
        var collector = joke.collectors;
        var user_id = getUserID();
        for (var k = 0; k < collector.length; k++) {
          if (user_id === collector[k]) {
            joke.isFavorite = true;
            break;
          }
        }
        arr.push(joke);
      }
    }
    return arr;
  },
  //公开getData，组件jokeList专属的请求方法
  getData: function(obj) {
    this.setIgnoreParams(['page']);
    var res = this.getFromLocalStorage(obj);
    this.getFromRemote(obj);
    return {
      data: []
    };
  },
  getFromRemote: function(obj) {
    var _this = this;
    var url = this.convertToUrl(obj.host, obj.params);
    wx.myRequest({
      url: obj.host,
      data: obj.params,
      method: obj.method || 'GET',
      success: function(res) {
        //处理响应数据，以符合接口
        res.data.data = _this.dataHandler(res.data);
        res.data.data = jokesConvertTime(res.data.data);
        obj.success(res.data);
        //将本地缓存更新
        if (res.data.code === 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            //完整的url作为key
            wx.setStorageSync(url + res.data.data[i]._id, res.data.data[i]);
          }
        }
      },
      fail: obj.fail,
      complete: obj.complete
    })
  },
  getFromLocalStorage: function(obj) {
    /**
     * 根据 url 从本地缓存取一类记录
     */
    var url = this.convertToUrl(obj.host, obj.params);
    //取得本地缓存所有key值
    var res = wx.getStorageInfoSync();
    var keys = res.keys;
    //取得符合url的keys
    var urlKeys = this.filterUrlKeys(keys, obj);
    //取得符合 urlKeys 的所有对象，并放到 data 
    var data = [];
    for (var i = 0; i < urlKeys.length; i++) {
      var obj = wx.getStorageSync(urlKeys[i]);
      data.push(obj);
    }
    var jokes = {
      code: 0,
      msg: 'success',
      data: data
    }
    return jokes;
  },
  convertToUrl: function(host, params) {
    host += '?';
    for (var item in params) {
      if (params.hasOwnProperty(item)) {
        host += item + '=' + params[item] + '&';
      }
    }
    return host.slice(0, host.length - 1);
  },
  setIgnoreParams: function(params) {
    this.ignoreParams = this.ignoreParams.concat(params);
  },
  filterUrlKeys: function(keys, obj) {
    var host = obj.host;
    var params = obj.params;
    //得到需匹配的参数
    var formalParams = {};
    for (var k in params) {
      var flag = true;
      for (var index = 0; index < this.ignoreParams.length; index++) {
        if (k == this.ignoreParams[index]) {
          flag = false;
          break;
        }
      }
      if (flag) formalParams[k] = params[k];
    }
    //若 host 和 formalParams 都匹配，则匹配成功
    var formalKeys = [];
    for (var i = 0; i < keys.length; i++) {
      var flag1, flag2;
      flag1 = false;
      flag2 = true;
      if (keys[i].indexOf(host) !== -1) {
        flag1 = true;
      }
      for (var j in formalParams) {
        var temp = j + '=' + formalParams[j];
        if (keys[i].indexOf(temp) === -1) {
          flag2 = false;
          break;
        }
      }
      if (flag1 && flag2) {
        formalKeys.push(keys[i]);
      }
    }
    return formalKeys;
  }
};

//组件errorRes的响应错误信息对象
var errMsg = {
  error: {
    img: '../../img/sorry.png',
    errText: '连接服务器出错~',
    btnText: '点我，重新加载'
  },
  empty: {
    img: '../../img/sorry.png',
    errText: '空空如也~',
    btnText: '点我，重新加载'
  }
}

/**
 * 本地存取
 */

const setCache = (name, obj) => {
  try {
    wx.setStorageSync(name, obj)
  } catch (e) {
    throw 'error'
  }
}

const getCache = (name) => {
  try {
    var value = wx.getStorageSync(name)
    return value
  } catch (e) {
    // Do something when catch error
  }
}

module.exports = {
  jokesConvertTime: jokesConvertTime,
  request: request,
  setNavigationBarColor: setNavigationBarColor,
  getNavigationBarColor: getNavigationBarColor,
  errMsg: errMsg,
  setUserID: setUserID,
  getUserID: getUserID,
  formatTime: formatTime,
  setCache: setCache,
  getCache: getCache
}