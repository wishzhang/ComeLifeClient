//app.js

App({
  fetchUserInfo:function(){
    
  },
  onLaunch: function () {
  },
  //一定要先在这里定义了，才能用，否则[object Undefined]
  globalData: {
    userInfo: null,
    isAuthorized:false,
    domain:'http://172.27.35.1:3000',
    talkInfo:{
      apiKey:'038845cf41ee4a92a0f3380dbb20b776',
      host:'http://openapi.tuling123.com/openapi/api/v2'
    },
    canuse:false
  }
})