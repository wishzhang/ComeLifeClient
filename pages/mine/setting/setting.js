// pages/mine/setting/setting.js
const util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    currentNavigationBarColor: '#303030',
    colors: [{
      color: '#FF3030'
    }, {
      color: '#FF4500'
    }, {
      color: '#FF1493'
    }, {
      color: '#FF8C00'
    }, {
      color: '#FFB5C5'
    }, {
      color: '#FFD700'
    }, {
      color: '#FFD39B'
    }, {
      color: '#EED2EE'
    }, {
      color: '#EE7AE9'
    }, {
      color: '#EE30A7'
    }, {
      color: '#CDCD00'
    }, {
      color: '#CD661D'
    }, {
      color: '#B9D3EE'
    }, {
      color: '#A6A6A6'
    }, {
      color: '#B0E2FF'
    }, {
      color: '#7CCD7C'
    }, {
      color: '#6A5ACD'
    }, {
      color: '#555555'
    }, {
      color: '#40E0D0'
    }, {
      color: '#303030'
    }, {
      color: '#008B00'
    }, {
      color: '#008B8B'
    }, {
      color: '#0000FF'
    }, {
      color: '#00008B'
    }, {
      color: '#0000AA'
    }]
  },
  setNavigationBarColor: function(e) {
    console.log(e);
    var dataset = e.target.dataset;
    var index = dataset.index;
    var item = dataset.item;
    if (JSON.stringify(dataset) === '{}') {
      console.log('{}');
      return;
    };
    var _this = this;
    if (item.color !== this.data.currentNavigationBarColor) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: item.color,
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        },
        success: function() {
          _this.setData({
            currentNavigationBarColor: item.color
          })
          wx.setStorageSync('navigationBarColor', item.color);
        },
        fail: function() {
          wx.showToast({
            title: '设置失败~',
            icon: 'none'
          })
        }
      })
    } else {
      wx.showToast({
        title: '已经设置啦~',
        icon: 'none'
      })
    }
  },
  onLoad: function() {
    var navigationBarColor = wx.getStorageSync('navigationBarColor');
    this.setData({
      currentNavigationBarColor: navigationBarColor
    })
  },
  onShow: function() {
    util.setNavigationBarColor();
  }
})