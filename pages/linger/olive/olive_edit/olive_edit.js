// pages/mine/oliveAdd/oliveAdd.js
const util = require('../../../../utils/util.js');
var app = getApp();
Page({
  relateData: function(e) {
    this.setData({
      oliveContent: e.detail.value
    })
  },
  fetchData: function() {
    this.postData();
  },
  postData: function() {
    wx.myRequest({
      url: app.globalData.domain + '/editOlive',
      data: this.data,
      method: 'POST',
      success: function(res) {
        console.log('res.data:' + res.data);
        if (res.data.code === 0) {
          wx.navigateBack();
        } else if (res.data.code === 1) {
          wx.showToast({
            title: '失败，服务器出错~',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '失败，服务器出错~',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  data: {
    oliveContent: '',
    olive_id: ''
  },
  onLoad: function(options) {
    console.log('options:' + JSON.stringify(options));
    this.setData({
      olive_id: options.olive_id,
      oliveContent: options.content
    })
  },
  onShow: function() {
    util.setNavigationBarColor();
  }
})