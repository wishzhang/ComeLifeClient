var app = getApp();
/**
 * 说明：
 * 1. 面向对象思想
 */

/**
 * 16进制颜色转为rgba格式，默认透明度0.05
 * */
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
String.prototype.colorRgb = function (opacity) {
  var opacity=opacity||0.15;
  var sColor = this.toLowerCase();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      var sColorNew = "#";
      for (var i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //处理六位的颜色值
    var sColorChange = [];
    for (var i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
    }
    sColorChange.push(opacity);
    return "rgba(" + sColorChange.join(",") + ")";
  } else {
    return sColor;
  }
};

/**
 * 本地存取对象
 */

const setCache = (name, obj) => {
  try {
    wx.setStorageSync(name, obj)
  } catch (e) {
    console.log(e)
  }
}

const getCache = (name) => {
  try {
    var obj = wx.getStorageSync(name)
    return obj
  } catch (e) {
    console.log(e)
  }
}

/**
 *  管理页面跳转
 */
const pageJump = {
  //跳到需要授权才能使用的页面
  toOwnPage: function (url) {
    if (!app.globalData.canuse) {
      wx.switchTab({
        url: '/pages/mine/mine',
        complete: function () {
          wx.showMyToast({
            title: '请先授权登录^_^'
          })
        }
      })
      return;
    }
    wx.navigateTo({
      url: url,
    })
  },
  //跳到不需要授权就能使用的页面
  toCommonPage: function (url) {
    wx.navigateTo({
      url: url,
    })
  }
}

/**
 * 优先使用该toast方法
 */
wx.showMyToast = function(obj) {
  if (!obj.title) {
    throw "must set title property!"
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
    }, obj.duration)
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

/**
 * 将Date对象转换成 年-月-日 时-分 字符串的格式
 */
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
 * 优先使用wx.myRequest，而不是wx.request
 */
wx.myRequest = function (obj) {
  obj.complete = obj.complete || function () { }
  obj.success = obj.success || function () { }
  obj.fail = obj.fail || function () { }
  wx.showLoading({
    title: '加载中...'
  })
  //没应用token
  var token = wx.getStorageSync('token')
  console.log('本地存储的token:', token)
  wx.request({
    url: obj.url,
    data: obj.data,
    method: obj.method,
    header: {
      token: token
    },
    success: function (res) {
      wx.setStorageSync('token', res.header.token)
      obj.success(res)
    },
    fail: function () {
      wx.showMyToast({
        title: '连接服务器出错~'
      })
      obj.fail()
    },
    complete: function () {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      obj.complete()
    }
  })
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

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
const errMsg = {
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

module.exports = {
  jokesConvertTime,
  request,
  setNavigationBarColor,
  getNavigationBarColor,
  errMsg,
  setUserID,
  getUserID,
  formatTime,
  setCache,
  getCache,
  pageJump
}