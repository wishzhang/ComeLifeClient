/**
 * 登录模块:底层的登录逻辑前后的相关处理已封装,仅对外提供登录状态，。
 * const login=require('');
 * login.start(function(status){
 *  if(status){
 *    console.log('登录成功')
 *  }
 * });
 */

const app=getApp();
const util=require('../utils/util.js');

var instance={
  showVisitorToast: function () {
    wx.showMyToast({
      title: '登录失败，您现在是游客身份~'
    })
  },
  fetchUserData:function(baseinfo,fun){
    fun=fun||function(){}
    var _this=this;
    app.globalData.userInfo = baseinfo;
    var user_id = util.getUserID(); //从本地存储拿到user_id
    if (user_id) {
      app.globalData.userInfo._id = user_id;
    }
    wx.myRequest({
      url:  app.url.login,
      method: 'POST',
      data: app.globalData.userInfo,
      success: function (res) {
        if (res.data.code === 0) {
          app.globalData.userInfo = res.data.data[0];
          app.globalData.canuse = true;
          util.setUserID(app.globalData.userInfo._id);
          fun.call(_this,1);
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
  },
  start:function(fun){
    var _this = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              _this.fetchUserData(res.userInfo,fun);
            },
            fail: function () {
              _this.showVisitorToast();
            }
          })
        }
      },
      fail: function () {
        _this.showVisitorToast();
      }
    })
  }
};

module.exports=instance;