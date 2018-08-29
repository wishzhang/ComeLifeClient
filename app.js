require('./common/converter/converter.js')

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
  },
  onShow:function(){
  },
  //一定要先在这里定义了，才能用，否则[object Undefined]
  globalData: {
    userInfo: {},
    domain:'https://www.zhangw.xyz',
   // domain:'http://localhost:3000',
    talkInfo:{
      apiKey:'038845cf41ee4a92a0f3380dbb20b776',
      host:'http://openapi.tuling123.com/openapi/api/v2'
    },
    //登录标志
    canuse:false
  },
  url: {
    talk: '/talk',
    login: '/oneUserJoke',
    lingerSentence: '/getSentences',
    feedbackAdd: '/addFeedback',
    getOlives: '/getOlives',
    editOlive: '/editOlive',
    addOlive: '/addOlive',
    addLike: '/addLike',
    delLike: '/delLike',
    getMyLikes: '/getMyLikes'
  }
})