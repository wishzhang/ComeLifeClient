var child = null;
var app = getApp();
require('../../utils/util.js');
//不授权无法继续使用
Page({
  data:{
    canuse:false
  },
  onLoad: function() {
    var _this = this;
    // 查看是否授权，有的功能需要获取个人信息才可进行下去。
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              app.globalData.userInfo = res.userInfo;
              wx.myRequest({
                url: app.globalData.domain + '/oneUserJoke',
                method: 'POST',
                data: app.globalData.userInfo,
                success: function(res) {
                  if (res.data.code === 0) {
                    app.globalData.userInfo = res.data.data[0];
                    app.globalData.canuse = true;
                    _this.setData({canuse:true});
                    app.globalData.isAuthorized = true;
                    child.refreshAllData();
                  }
                },
                complete: function() {
                  console.log('app.globalData:' + JSON.stringify(app.globalData));
                }
              })
            }
          })
        }
      }
    })
  },
  onShow: function() {
    this.setData({
      canuse:app.globalData.canuse
    })
    if(app.globalData.canuse){
      child.refreshAllData();
    }
  },
  onPullDownRefresh() {
    if (app.globalData.canuse) {
      child.refreshAllData();
    }
  },
  onReachBottom: function() {},
  //获取子组件对象jokeList
  fetchChild: function(e) {
    child = e.detail;
  }
})