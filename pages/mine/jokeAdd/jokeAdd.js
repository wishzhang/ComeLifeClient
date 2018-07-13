// pages/mine/jokeAdd/jokeAdd.js
const util = require('../../../utils/util.js');
var app = getApp();
Page({
  relateData: function(e) {
    this.setData({
      jokeContent: e.detail.value
    })
  },
  fetchData:function() {
    this.postData();
  },
  postData: function() {
    wx.myRequest({
      url: app.globalData.domain + '/userJokeAdd',
      data: this.data,
      method:'POST',
      success: function(res) {
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
      fail: function() {
        wx.showToast({
          title: '发布失败，服务器内部错误',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  data: {
    nickName: '',
    gender: '',
    city: '',
    province: '',
    country: '',
    avatarUrl: '',
    jokeContent: ''
  },
  onLoad: function(options) {
    var userInfo = app.globalData.userInfo;
    this.setData({
      nickName: userInfo.nickName,
      iconPath: userInfo.avatarUrl,
      gender: userInfo.gender,
      city: userInfo.city,
      province: userInfo.province,
      country: userInfo.country,
      avatarUrl: userInfo.avatarUrl
    })
  }
})