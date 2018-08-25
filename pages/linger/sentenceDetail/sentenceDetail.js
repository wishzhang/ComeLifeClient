const util = require('../../../utils/util.js');
Page({
  data: {
    sentence:{}
  },
  onLoad: function (options) {
    util.setNavigationBarColor();
    this.setData({
      defaultImg:'../../img/default.png',
      sentence:options
    })
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  }
})