/**
 * 该组件为joke列表的展示
 * 父组件监听childobj事件得到子组件实例
 * ->父组件在onLoad还没得到子组件实例，在onShow以后调用相关方法
 */
const WARN_EMPTY = '空空如也，~';
const WARN_ERROR = '数据响应失败~';
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
    warn: {
      canSee: 'none',
      warnMsg: ''
    },
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
      var localRes = util.request.getData({
        host: app.globalData.domain + url,
        params: params,
        method: 'POST',
        success: function(res) {
          _this.dataHandler().success(res, localRes);
        },
        fail: function() {
          _this.dataHandler().fail(localRes);
        },
        complete: function() {
          wx.hideLoading();
          wx.stopPullDownRefresh();
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
          //在展示前时刻，将data排序
          jokes.sort(compare('publishTime'));
          _this.setData({
            warn: {
              canSee: 'none'
            },
            allJokes: jokes
          })
        },
        code1: function() {
          if (_this.data.allJokes.length === 0) {
            _this.setData({
              warn: {
                canSee: 'block',
                warnMsg: WARN_EMPTY
              }
            })
          } else {
            wx.showToast({
              title: '无新纪录~',
            })
          }
        },
        code2: function() {
          if (_this.data.allJokes.length !== 0) {
            wx.showToast({
              title: '连接服务器出错~',
            })
          } else {
            wx.showModal({
              content: '连接服务器出错,重新加载？',
              success: function(res) {
                if (res.confirm) {
                  _this.fetchData(url, params);
                } else {
                  _this.setData({
                    warn: {
                      canSee: 'block',
                      warnMsg: WARN_ERROR
                    }
                  })
                }
              }
            })
          }
        },
        code3: function() {
          _this.setData({
            noMore: true
          })
        }
      };
      var setFailData = function(localRes) {
        if (localRes.data.length !== 0) {
          //若网络请求，则启用缓存，注意：缓存数据也需分页展示！
          setSuccessData.code0(localRes.data);
          wx.showToast({
            title: '连接服务器出错~',
          })
        } else {
          wx.showModal({
            content: '连接服务器出错,重新加载？',
            success: function(res) {
              if (res.confirm) {
                _this.fetchData(url, params);
              } else {
                _this.setData({
                  warn: {
                    canSee: 'block',
                    warnMsg: WARN_ERROR
                  }
                })
              }
            }
          })
        }
      };

      var success = function(res) {
        console.log(res);
        if (res.code === 0) {
          setSuccessData.code0(res.data);
        } else if (res.code === 1) { //無記錄
          setSuccessData.code1();
        } else if (res.code === 3) { //无更多
          setSuccessData.code3();
        } else { //服务器返回错误 code===2或...
          setFailData(localRes)
        }
      };

      var fail = function(localRes) {
        setFailData(localRes);
      };

      return {
        success: success,
        fail: fail,
        setSuccessData: setSuccessData
      }
    },
    /**
     * 最新接口
     */
    refreshAllData: function() {
      this.fetchData('/allUserJoke');
    },
    refreshOneUserData: function() {
      this.fetchData('/oneUserJoke',{user_id:app.globalData.userInfo._id});
    },
    refreshCollectionData: function() {
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
          var jokes = dataHandler(res.data);
          _this.setData({
            allJokes: jokes
          })
        },
        fail: function() {
          wx.showToast({
            title: '服务器响应错误~'
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