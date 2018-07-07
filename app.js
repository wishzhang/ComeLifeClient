//app.js
App({
  onLaunch: function () {
    var _this=this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log('userInfo:'+JSON.stringify(res.userInfo));
              _this.globalData.userInfo=res.userInfo;
            }
          })
          _this.globalData.isAuthorized = true;
        }
      }
    })
  },
  //一定要先在这里定义了，才能用，否则[object Undefined]
  globalData: {
    token:'',
    userInfo: null,
    isAuthorized:false,
    domain:'http://172.27.35.1:3000'
  }
})