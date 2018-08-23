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
    login.start(function(status){
      
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