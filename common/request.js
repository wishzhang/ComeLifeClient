/**
 * 封装请求配置,挂载到app.req
 * 接口使用eg：
 * const app=getApp()
 * app.req.getTalk(data,function(err,res){
 *    if(err){
 *      console.log(err)
 *    }
 *    console.dir(res)
 * })
 */
const host ='https://www.zhangw.xyz'
const url = {
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
//统一网络请求接口
wx.myRequest = function (obj) {
  obj.complete = obj.complete || function () { }
  obj.success = obj.success || function () { }
  obj.fail = obj.fail || function () { }
  obj.method = obj.method || 'POST'
  // wx.showLoading({
  //   title: '加载中...'
  // })
  //没应用token
  var token = wx.getStorageSync('token')
  console.log('本地存储的token:', token)
  wx.request({
    url: host + obj.url,
    data: obj.data,
    method: obj.method,
    header: {
      token: token
    },
    success: function (res) {
      wx.setStorageSync('token', res.header.token)
      obj.success(res)
    },
    fail: function () {
      wx.showMyToast({
        title: '连接服务器出错~'
      })
      obj.fail()
    },
    complete: function () {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      obj.complete()
    }
  })
}

/**
 * 登录
 */
const login=function(data,fun){
  wx.myRequest({
    url:url.login,
    data:data,
    success:function(res){
      fun(null,res.data)
    },
    fail:function(res){
      fun(res,null)
    },
    complete: function () {
      const app = getApp();
      console.log('user data:' + JSON.stringify(app.globalData.userInfo));
    }
  })
}

/**
 * 句子迷
 */
const getLingerSentence=function(data,fun){
  wx.myRequest({
    url: url.lingerSentence,
    data:data||{},
    success: function (res) {
      fun(null,res.data);
    },
    fail:function(res){
      fun(res,null)
    }
  })
}

/**
 * 言语
 */

const getTalk=function(data,fun){
  wx.myRequest({
    url: url.talk,
    data:data,
    success: function (res) {
      fun(null,res.data)
    },
    fail:function(res){
      fun(res,null)
    }
  })
}

/**
 * 快乐清单
 */
const getOlive=function(data,fun){
  wx.myRequest({
    url: url.getOlives,
    data:data,
    success:function(res){
      fun(null,res.data)
    },
    fail:function(res){
      fun(res,null)
    }
  })
}

const addOlive = function (data, fun) {
  wx.myRequest({
    url: url.addOlive,
    data: data,
    success: function (res) {
      fun(null, res.data)
    },
    fail: function (res) {
      fun(res, null)
    }
  })
}

const editOlive = function (data, fun) {
  wx.myRequest({
    url: url.editOlive,
    data: data,
    success: function (res) {
      fun(null, res.data)
    },
    fail: function (res) {
      fun(res, null)
    }
  })
}

/**
 * 我的喜欢
 */
const getLike=function(data,fun){
  wx.myRequest({
    url:url.getMyLikes,
    data:data,
    success:function(res){
      fun(null,res.data)
    },
    fail:function(res){
      fun(res,null)
    }
  })
}

const addLike=function(data,fun){
  wx.myRequest({
    url:url.addLike,
    data:data,
    success:function(res){
      fun(null,res.data)
    },
    fail:function(res){
      fun(res,null)
    }
  })
}

const delLike=function(data,fun){
  wx.myRequest({
    url:url.delLike,
    data:data,
    success:function(res){
      fun(null,res.data)
    },
    fail:function(res){
      fun(res,null)
    }
  })
}

/**
 * 留言与反馈
 */
const addFeedback=function(data,fun){
  wx.myRequest({
    url:url.feedbackAdd,
    data:data,
    success:function(res){
      fun(null,res.data)
    },
    fail:function(res){
      fun(res,null)
    }
  })
}


module.exports={
  login,
  getLingerSentence,
  getTalk,
  getOlive,
  addOlive,
  editOlive,
  getLike,
  addLike,
  delLike,
  addFeedback
}

