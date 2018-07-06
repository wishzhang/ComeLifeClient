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

  /**
   * 页面的初始数据
   */
  data: {
    userID:'',
    userName:'',
    jokeContent:'',
    iconPath:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = app.globalData.userInfo;
    this.setData({
      userID: userInfo.nickName,
      userName: userInfo.nickName,
      iconPath: userInfo.avatarUrl
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})