// pages/mine/jokeAdd/jokeAdd.js
var app=getApp();
Page({
  relateData:function(e){
    this.setData({
      jokeContent:e.detail.value
    })
  },
  postData:function(){
    wx.request({
      url: app.globalData.domain+'/jokeAdd',
      data:this.data,
      success:function(res){
        console.log('res.data:'+res.data);
        if(res.data.code===0){
          wx.showToast({
            title: '发布成功',
            icon: 'none',
            duration: 2000
          })
          wx.navigateBack();
        }else if(res.data.code===1){
          wx.showToast({
            title: '发布失败，服务器内部错误',
            icon:'none',
            duration:2000
          })
        }
      },
      fail:function(){
        wx.showToast({
          title: '发布失败，服务器内部错误',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  data: {
    userID:'',
    userName:'',
    jokeContent:'',
    iconPath:''
  },
  onLoad: function (options) {
    var userInfo = app.globalData.userInfo;
    this.setData({
      userID: userInfo.nickName,
      userName: userInfo.nickName,
      iconPath: userInfo.avatarUrl
    })
  }
})