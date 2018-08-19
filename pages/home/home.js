var child = null;
var app = getApp();
var util = require('../../utils/util.js');
//不授权无法继续使用
Page({
  data: {
    canuse: false
  },
  init: function() {
    util.setNavigationBarColor();
  },
  //登录并获取用户个人信息
  onLoad: function() {

    
    var _this = this;
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              app.globalData.userInfo = res.userInfo;
              var user_id=util.getUserID();
              if(user_id){
                app.globalData.userInfo._id=user_id;
              }
              wx.myRequest({
                url: app.globalData.domain + '/oneUserJoke',
                method: 'POST',
                data: app.globalData.userInfo,
                success: function(res) {
                  if (res.data.code === 0) {
                    app.globalData.userInfo = res.data.data[0];
                    app.globalData.canuse = true;
                    _this.setData({
                      canuse: true
                    });
                    util.setUserID(app.globalData.userInfo._id);
                  } else {
                    _this.showVisitorToast();
                  }
                },
                fail: function() {
                  _this.showVisitorToast();
                },
                complete: function() {
                  console.log('app.globalData:' + JSON.stringify(app.globalData));
                }
              })
            },
            fail: function() {
              _this.showVisitorToast();
            }
          })
        }
      },
      fail: function() {
        _this.showVisitorToast();
      }
    })
  },
  showVisitorToast: function() {
    wx.showToast({
      title: '您现在是游客身份哦~',
      icon:'none'
    })
  },
  onShow: function() {
    this.init();
    this.setData({
      canuse: app.globalData.canuse
    })
    child.refreshAllData();
  },
  onPullDownRefresh() {
    child.refreshAllData();
  },
  onReachBottom: function() {},
  //获取子组件对象jokeList
  fetchChild: function(e) {
    child = e.detail;
  },
  errHandler:function(e){
    child.refreshAllData();
  }
})