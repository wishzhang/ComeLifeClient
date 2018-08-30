require('./common/converter/converter.js')
const req=require('./common/request.js')
App({
  onLaunch: function () {
    //打印本地缓存使用情况
    wx.getStorageInfo({
      success: function (res) {
        console.log(res.keys)
        console.log(res.currentSize+'KB')
        console.log(res.limitSize+'KB')
      }
    })
    wx.showShareMenu({
      withShareTicket: true
    })
    //挂载网络请求
    this.useRequest(req)
  },
  onShow:function(){
  },
  useRequest:function(obj){
    this.req=obj
  },
  //一定要先在这里定义了，才能用，否则[object Undefined]
  globalData: {
    userInfo: {},
    talkInfo:{
      apiKey:'038845cf41ee4a92a0f3380dbb20b776',
      host:'http://openapi.tuling123.com/openapi/api/v2'
    },
    //登录标志
    canuse:false
  }
})