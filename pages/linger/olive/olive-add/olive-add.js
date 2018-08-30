
const util = require('../../../../utils/util.js');
const storage = require('../../../../common/storage.js');
const app = getApp();
Page({
  data: {
    bgColor: storage.getNavigationBarColor(),
    oliveContent: ''
  },
  init: function () {
    storage.setNavigationBarColor();
    this.setData({
      bgColor: storage.getNavigationBarColor()
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
        title:'请记录下让你开心的事情^_^'
      })
      return;
    }

    app.req.addOlive({
      user_id: app.globalData.userInfo._id,
      oliveContent: this.data.oliveContent
    },function(err,r){
      if(err){
        wx.showToast({
          title: '添加失败，请检查网络连接~'
        })
        return;
      }
      if (r.code === 0) {
        wx.navigateBack();
      } else if (r.code === 1) {
        wx.showToast({
          title: '添加失败，服务器内部出错~'
        })
      }
    })
  },
  onLoad: function (options) {
    this.init();
  }
})