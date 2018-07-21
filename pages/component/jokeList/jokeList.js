/**
 * 该组件为joke列表的展示
 * 父组件监听childobj事件得到子组件实例
 * ->父组件在onLoad还没得到子组件实例，在onShow以后调用相关方法
 */
var errMsg={
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
var app = getApp();
var util = require('../../../utils/util.js');

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    canuse:{
      type:Boolean,
      value:false
    }
  },
  data: {
    noMore: false,
    errSee:false,
    myError: {},
    allJokes: []
  },
  methods: {
    tapFavorite: function(e) {
      var _this = this;
      var dataset = e.currentTarget.dataset;
      var index = dataset.index;
      var item = dataset.item;

      if (item.isFavorite) {
        wx.myRequest({
          url: app.globalData.domain + '/jokeCollectorRemove',
          method: 'POST',
          data: {
            joke_id: item._id,
            user_id: app.globalData.userInfo._id
          },
          success: function(res) {
            _this.data.allJokes[index].isFavorite = false;
            _this.setData({
              allJokes: _this.data.allJokes
            })
          },
          fail: function() {},
          complete: function() {}
        })
      } else {
        wx.myRequest({
          url: app.globalData.domain + '/jokeCollectorAdd',
          method: 'POST',
          data: {
            joke_id: item._id,
            user_id: app.globalData.userInfo._id
          },
          success: function(res) {
            _this.data.allJokes[index].isFavorite = true;
            _this.setData({
              allJokes: _this.data.allJokes
            })
          },
          fail: function() {},
          complete: function() {}
        })
      }
    },
    fetchData: function(url, params) {
      var _this = this;
      util.request.getData({
        host: app.globalData.domain + url,
        params: params,
        method: 'POST',
        success: function(res) {
          _this.dataHandler().success(res);
        },
        fail: function() {
          _this.dataHandler().fail();
        }
      });
    },
    dataHandler: function() {
      var _this = this;
      //比较器，从大到小
      var compare = function(prop) {
        return function(obj1, obj2) {
          var val1 = obj1[prop];
          var val2 = obj2[prop];
          if (val1 > val2) {
            return -1;
          } else if (val1 < val2) {
            return 1;
          } else {
            return 0;
          }
        }
      };

      var setSuccessData = {
        code0: function(jokes) {
          if(jokes.length===0){
            _this.setData({
              errSee:true,
              myError:errMsg.empty
            })
            return;
          }
          //在展示前时刻，将data排序
          jokes.sort(compare('publishTime'));
          _this.setData({
            errSee:false,
            allJokes: jokes
          })
        },
        code1: function() {
          _this.setData({
            errSee: true,
            myError: errMsg.error
          })
        }
      };
      var setFailData = function(localRes) {
        _this.setData({
          errSee: true,
          myError: errMsg.error
        })
      };

      var success = function(res) {
        if (res.code === 0) {
          console.log(res.data);
          setSuccessData.code0(res.data);
        } else if (res.code === 1) { //服务器错误
          setSuccessData.code1();
        } 
      };

      var fail = function(localRes) {
        setFailData();
      };

      return {
        success: success,
        fail: fail,
        setSuccessData: setSuccessData
      }
    },
    errHandler:function(e){
      this.triggerEvent('errBtn',e);
    },
    /**
     * 最新接口
     */
    refreshAllData: function() {
      this.setData({
        myError: {}
      })
      this.fetchData('/allUserJoke');
    },
    refreshOneUserData: function() {
      this.setData({
        myError:{}
      })
      this.fetchData('/oneUserJoke',{_id:app.globalData.userInfo._id});
    },
    refreshCollectionData: function() {
      this.setData({
        myError: {}
      })
      var _this = this;
      var dataHandler = function(data) {
        var users = data.data;
        var arr = [];
        for (var i = 0; i < users.length; i++) {
          var user = users[i];
          var r = user.collections;
          for (var j = 0; j < r.length; j++) {
            var collection = r[j];
            collection.nickName = user.nickName;
            collection.gender = user.gender;
            collection.city = user.city;
            collection.province = user.province;
            collection.country = user.country;
            collection.avatarUrl = user.avatarUrl;
            collection.isFavorite = false;
            var collector = collection.collectors;
            var user_id = app.globalData.userInfo._id;
            for (var k = 0; k < collector.length; k++) {
              if (user_id === collector[k]) {
                collection.isFavorite = true;
                break;
              }
            }
            arr.push(collection);
          }
        }
        return arr;
      }
      wx.myRequest({
        url: app.globalData.domain + '/getUserCollections',
        data: {
          user_id: app.globalData.userInfo._id
        },
        method: 'POST',
        success: function(res) {
          var r=res.data;
          if(r.code===0){
            var jokes = dataHandler(res.data);
            if(jokes.length===0){
              _this.setData({
                errSee: true,
                myError:errMsg.empty
              })
            }else{
              _this.setData({
                errSee: false,
                allJokes: jokes
              })
            }
          }
        },
        fail: function() {
          _this.setData({
            errSee:true,
            myError:errMsg.error
          })
        },
        complete: function() {

        }
      })
    }
  },
  attached: function() {
    this.triggerEvent('childobj', this, {});
  }
})