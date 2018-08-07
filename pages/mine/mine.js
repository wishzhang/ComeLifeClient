// pages/mine/mine.js
var app=getApp();
const util = require('../../utils/util.js');
Page({
  init:function(){
    util.setNavigationBarColor();
    this.setData({
      navigationBarColor: util.getNavigationBarColor()
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    navigationBarColor: util.getNavigationBarColor(),
    canuse:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    items: [{
      name: '我的投稿',
      iconPath: './contribution.png'
    },{
      name: '我的收藏',
      iconPath: './collection.png'
    }, {
      name: '我的設置',
      iconPath: './setting.png'
    }, {
      name: '反馈与建议',
      iconPath: './feedback.png'
    }]
  },
  bindGetUserInfo: function (e) {
    var _this=this;
    var userInfo = e.detail.userInfo;
    if(userInfo){
      app.globalData.userInfo=userInfo;
      var user_id=util.getUserID();
      if(user_id){
        app.globalData.userInfo._id=user_id;
      }
      wx.myRequest({
        url: app.globalData.domain + '/oneUserJoke',
        method: 'POST',
        data: app.globalData.userInfo,
        success: function (res) {
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
        fail: function () {
          _this.showVisitorToast();
        },
        complete: function () {
          console.log('app.globalData:' + JSON.stringify(app.globalData));
        }
      })
    }else{
      wx.showToast({
        title: '授权失败~',
        icon:'none'
      })
    }
  },
  showVisitorToast: function () {
    wx.showToast({
      title: '服务器响应出错，登录失败~',
      icon:'none',
      duration:3000
    })
  },
  showErrorToast:function(){
    wx.showToast({
      title: '请先授权登录呀~',
      icon: 'none',
      duration: 2000
    })
  },
  turnToPageCanuse:function(url){
    if (!this.data.canuse) {
      this.showErrorToast();
      return;
    }
    wx.navigateTo({
      url: url
    });
  },
  bindTapCollection:function(){
    this.turnToPageCanuse('./collection/collection');
  },
  bindTapToContribution: function () {
    this.turnToPageCanuse('./contribution/contribution');
  },
  bindTapToSetting: function (e) {
    this.turnToPageCanuse('./setting/setting');
  },
  bindTapToFeedback:function(e){
    wx.navigateTo({
      url:'./feedback/feedback'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //由于获取授权是异步的，所以这里需同步一下
    this.setData({
      canuse: app.globalData.canuse
    })
  },
  onShow:function(){
    this.init();
  }
})