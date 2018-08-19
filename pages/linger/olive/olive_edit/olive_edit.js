
const util = require('../../../../utils/util.js');
var app = getApp();
Page({
  data: {
    bgColor: util.getNavigationBarColor(),
    oliveContent: '',
    olive_id: ''
  },
  init: function () {
    this.setData({
      bgColor: util.getNavigationBarColor()
    })
  },
  relateData: function(e) {
    this.setData({
      oliveContent: e.detail.value
    })
  },
  fetchData: function() {
    this.postData();
  },
  postData: function() {
    if (!this.data.oliveContent.trim()) {
      wx.showMyToast({
        title: '请写点啥~'
      })
      return;
    }
    wx.myRequest({
      url: app.globalData.domain + app.globalData.api.editOlive,
      data: this.data,
      method: 'POST',
      success: function(res) {
        if (res.data.code === 0) {
          wx.navigateBack();
        } else if (res.data.code === 1) {
          wx.showMyToast({
            title: '失败，服务器出错~'
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '失败，服务器出错~'
        })
      }
    })
  },
  onLoad: function(options) {
    this.init();
    this.setData({
      olive_id: options.olive_id,
      oliveContent: options.content
    })
  },
  onShow: function() {
    util.setNavigationBarColor();
  }
})