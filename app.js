
App({

  onLaunch: function () {

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
    //账号访问控制标志
    canuse:false,
    key:{
      TALK:'talk'
    }
  },
  url: {
    talk: '/talk',
    login: '/oneUserJoke',
    lingerSentence: '/getSentences',
    feedbackAdd: '/addFeedback',
    getOlives: '/getOlives',
    editOlive: '/editOlive',
    addOlive: '/addOlive'
  }
})