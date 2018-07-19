// pages/mine/feedback/feedback.js
const util = require('../../../utils/util.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  formSubmit:function(e){
    var data=e.detail.value;
    data.user_id=app.globalData.userInfo._id;
    console.log('form-data:'+JSON.stringify(data));
    wx.myRequest({
      url:app.globalData.domain+'/addFeedback',
      data:data,
      method:'POST',
      success:function(res){
        var r=res.data;
        if(r.code===0){
          wx.showToast({
            title: '提交成功',
            duration:3000
          })
        }else if(r.code===1){
          wx.showToast({
            title: '提交失败~',
            icon: 'none'
          })
        }
      },
      fail:function(){
        wx.showToast({
          title: '提交失败~',
          icon:'none'
        })
      },
      complete:function(){

      }
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