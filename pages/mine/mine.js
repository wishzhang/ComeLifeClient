// pages/mine/mine.js
var app=getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isAuthorized: app.globalData.isAuthorized,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    items: [{
      id: 1,
      name: '我的投稿',
      iconPath: './mine.png'
    }, {
      id: 2,
      name: '我的設置',
      iconPath: './mine.png'
    }]
  },
  bindGetUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo;
    if(e.detail.userInfo){
      app.globalData.isAuthorized=true;
    }else{
      app.globalData.isAuthorized = false;
    }
    this.setData({
      isAuthorized: app.globalData.isAuthorized
    })
  },
  bindTapToContribution: function () {
    if (!this.data.isAuthorized){
      wx.showToast({
        title: '请先授权登录',
        icon:'none',
        duration:2000
      })
      return;
    }
    wx.navigateTo({
      url: './contribution/contribution'
    });
  },
  bindTapToSetting: function (event) {
    if (!this.data.isAuthorized) {
      wx.showToast({
        title: '请先授权登录',
        icon:'none',
        duration: 2000
      })
      return;
    }
    wx.navigateTo({
      url: './setting/setting'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //由于获取授权是异步的，所以这里需同步一下
    this.setData({
      isAuthorized: app.globalData.isAuthorized
    })
  }
})