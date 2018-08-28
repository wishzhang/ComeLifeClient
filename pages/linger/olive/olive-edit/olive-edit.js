const util = require('../../../../utils/util.js');
const storage = require('../../../../common/storage.js');
var app = getApp();
Page({
  data: {
    bgColor: storage.getNavigationBarColor(),
    oliveContent: '',
    olive_id: ''
  },
  init: function () {
    storage.setNavigationBarColor()
    this.setData({
      bgColor: storage.getNavigationBarColor()
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
        title: '请记录下让你开心的事情^_^'
      })
      return;
    }
    wx.myRequest({
      url:  app.url.editOlive,
      data:{
        oliveContent: this.data.oliveContent,
        olive_id: this.data.olive_id
      },
      success: function(res) {
        if (res.data.code === 0) {
          wx.navigateBack();
        } else if (res.data.code === 1) {
          wx.showMyToast({
            title: '添加失败，服务器内部出错~'
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '添加失败，请检查网络连接~'
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
  }
})