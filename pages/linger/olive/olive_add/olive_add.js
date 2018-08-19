// pages/mine/oliveAdd/oliveAdd.js
const util = require('../../../../utils/util.js');
var app = getApp();
Page({
  data: {
    bgColor: util.getNavigationBarColor(),
    oliveContent: '',
    user_id: ''
  },
  init: function () {
    this.setData({
      bgColor: util.getNavigationBarColor()
    })
  },
  relateData: function (e) {
    this.setData({
      oliveContent: e.detail.value
    })
  },
  fetchData: function () {
    this.postData();
  },
  postData: function () {
    if (!this.data.oliveContent.trim()){
      wx.showMyToast({
        title:'请写点啥~'
      })
      return;
    }
    wx.myRequest({
      url: app.globalData.domain + app.globalData.api.addOlive,
      data: this.data,
      method: 'POST',
      success: function (res) {
        if (res.data.code === 0) {
          wx.navigateBack();
        } else if (res.data.code === 1) {
          wx.showToast({
            title: '失败，服务器出错~'
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '失败，服务器出错~'
        })
      }
    })
  },
  onLoad: function (options) {
    this.init();

    this.setData({
      user_id: app.globalData.userInfo._id
    })
  },
  onShow: function () {
    util.setNavigationBarColor();
  }
})