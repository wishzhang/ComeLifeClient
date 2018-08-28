const app=getApp();
const util = require('../../utils/util.js');
const login=require('../../common/login.js');
const storage=require('../../common/storage.js')
Page({
  init:function(){
    storage.setNavigationBarColor();
    this.setData({
      navigationBarColor: storage.getNavigationBarColor(),
      canuse: app.globalData.canuse
    })
  },
  data: {
    navigationBarColor: storage.getNavigationBarColor(),
    canuse:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    items: [{
      name: '我的投稿',
      iconPath: './contribution.png'
    },{
      name: '我的喜欢',
      iconPath: './collection.png'
    }, {
      name: '我的设置',
      iconPath: './setting.png'
    }, {
      name: '留言与反馈',
      iconPath: './feedback.png'
    }]
  },
  bindGetUserInfo: function (e) {
    var _this=this;
    var userInfo = e.detail.userInfo;
    if(userInfo){
      login.fetchUserData(userInfo,function(status){
        if(status){
          _this.setData({
            canuse: true
          });
        }
      })
    }else{
      wx.showMyToast({
        title: '授权失败~'
      })
    }
  },
  bindTapCollection:function(){
    util.pageJump.toOwnPage('./like/like')
  },
  bindTapToContribution: function () {
    util.pageJump.toOwnPage('./contribution/contribution')
  },
  bindTapToSetting: function (e) {
    util.pageJump.toOwnPage('./setting/setting')
  },
  bindTapToFeedback:function(e){
    util.pageJump.toCommonPage('./feedback/feedback')
  },
  onLoad: function(options) {
  },
  onShow:function(){
    this.init();
  }
})