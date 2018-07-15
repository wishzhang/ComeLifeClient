// pages/linger/linger.js
const util=require('../../utils/util.js')
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sentences:[]
  },
  fetchSentences:function(){
    var _this=this;
    wx.myRequest({
      url:app.globalData.domain+'/getSentences',
      method:'POST',
      success:function(res){
        var r=res.data;
        if(r.code===0){
          _this.setData({
            sentences:r.data
          })
        }else{
          wx.showToast({
            title: '服务器响应失败~',
            icon:'none'
          })
        }
      },
      fail:function(){
        wx.showToast({
          title: '服务器响应失败~',
          icon: 'none'
        })
      }
    })
  },
  turnToTalkPage:function(){
    wx.navigateTo({
      url: 'talk/talk',
    })
  },
  turnToOlivePage:function(){
    wx.navigateTo({
      url: 'olive/olive',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    util.setNavigationBarColor();
    this.fetchSentences();
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
    this.fetchSentences();
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