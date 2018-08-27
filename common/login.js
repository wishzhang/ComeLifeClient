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
const storage=require('../common/storage.js')

let instance={
  showVisitorToast() {
    wx.showMyToast({
      title: '登录失败，请检查网络连接~'
    })
  },
  fetchUserData:function(baseinfo,fun){
    fun=fun||function(){}
    let that=this;
    app.globalData.userInfo = baseinfo; //用户基本信息，后台创建user_id时要用到
    let user_id = storage.getUserID(); //从本地存储拿到user_id
    //小程序：
    //有user_id就带上user_id拉取数据,
    //若没有，后台生成user_id来标志用户身份，将user_id存储在小程序本地
    if (user_id) {
      app.globalData.userInfo._id = user_id;
    }
    wx.myRequest({
      url:  app.url.login,
      data: app.globalData.userInfo,
      success: function (res) {
        if (res.data.code === 0) {
          app.globalData.userInfo = res.data.data[0];
          app.globalData.canuse = true;
          storage.setUserID(app.globalData.userInfo._id);
          fun.call(that,1);
        } else {
          that.showVisitorToast();
        }
      },
      fail: function () {
        that.showVisitorToast();
      },
      complete: function () {
        console.log('user data:' + JSON.stringify(app.globalData.userInfo));
      }
    })
  },
  start:function(fun){
    let that = this;
    //必须先取得授权（得到用户基本信息），才允许登录，后台才分配user_id！
    //若授权失败，这里默认不提醒用户！
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              that.fetchUserData(res.userInfo,fun);
            }
          })
        }
      }
    })
  }
};

module.exports=instance;