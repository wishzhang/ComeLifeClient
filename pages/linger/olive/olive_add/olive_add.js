// pages/mine/oliveAdd/oliveAdd.js
const util = require('../../../../utils/util.js');
var app = getApp();
Page({
  relateData: function (e) {
    this.setData({
      oliveContent: e.detail.value
    })
  },
  fetchData: function () {
    this.postData();
  },
  postData: function () {
    wx.myRequest({
      url: app.globalData.domain + '/addOlive',
      data: this.data,
      method: 'POST',
      success: function (res) {
        console.log('res.data:' + res.data);
        if (res.data.code === 0) {
          wx.showToast({
            title: '发布成功',
            icon: 'none',
            duration: 2000
          })
          wx.navigateBack();
        } else if (res.data.code === 1) {
          wx.showToast({
            title: '发布失败，服务器内部错误',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '发布失败，服务器内部错误',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  data: {
    oliveContent:'',
    user_id:''
  },
  onLoad: function (options) {
    this.setData({
      user_id: app.globalData.userInfo._id
    })
  },
  onShow: function () {
    util.setNavigationBarColor();
  }
})