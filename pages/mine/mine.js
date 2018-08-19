var app=getApp();
const util = require('../../utils/util.js');
const login=require('../../common/login.js');
Page({
  init:function(){
    util.setNavigationBarColor();
    this.setData({
      navigationBarColor: util.getNavigationBarColor()
    })
  },
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
      login.fetchUserData(userInfo,function(status){
        if(status){
          _this.setData({
            canuse: true
          });
        }
      })
    }else{
      wx.showMyToast({
        title: '没有授权~'
      })
    }
  },
  bindTapCollection:function(){
    util.pageJump.toOwnPage('./collection/collection')
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
    this.setData({
      canuse: app.globalData.canuse
    })
  },
  onShow:function(){
    this.init();
  }
})