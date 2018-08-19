
const util = require('../../../utils/util.js');
const app = getApp();
Page({
  data: {
    bgColor: util.getNavigationBarColor(),
    olives: [],
    user_id: '',
    errSee: false,
    myError: {}
  },
  init: function () {
    this.setData({
      bgColor: util.getNavigationBarColor()
    })
  },
  errHandler: function() {
    this.fetchOlives();
  },
  turnToOliveEditPage: function(e) {
    var dataset = e.currentTarget.dataset;
    var item = dataset.item;
    var olive_id = item._id;
    var oliveContent = item.content;
    var url = './olive_edit/olive_edit?olive_id=' + olive_id + '&content=' + oliveContent;
    util.pageJump.toOwnPage(url);
  },
  deleteOlive: function(e) {

  },

  del: function() {
    var _this = this;
    var dataset = e.currentTarget.dataset;
    var item = dataset.item;
    var olive_id = item._id;
    wx.myRequest({
      url: app.globalData.domain + '/deleteOlive',
      data: {
        olive_id: olive_id
      },
      method: 'POST',
      success: function(res) {
        var r = res.data;
        if (r.code === 0) {
          _this.setData({
            olives: r.data
          })
        } else if (r.code === 1) {
          wx.showToast({
            title: '响应失败',
            icon: 'none'
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '响应失败',
          icon: 'none'
        })
      }
    })
  },
  fetchOlives: function() {
    this.setData({
      errSee: false
    })
    var _this = this;
    wx.myRequest({
      url: app.globalData.domain + app.globalData.api.getOlives,
      data: {
        user_id: this.data.user_id
      },
      method: 'POST',
      success: function(res) {
        var r = res.data;
        if (r.code === 0) {
          if (r.data.length === 0) {
            _this.setData({
              errSee: true,
              myError: util.errMsg.empty
            })
            return;
          }
          _this.dataHandler(r.data);
          r.data = util.jokesConvertTime(r.data);
          _this.setData({
            errSee: false,
            olives: r.data
          })
        } else if (r.code === 1) {
          _this.setData({
            errSee: true,
            myError: util.errMsg.error
          })
        }
      },
      fail: function() {
        _this.setData({
          errSee: true,
          myError: util.errMsg.error
        })
      }
    })
  },
  dataHandler: function(arrs) {
    const mySort = function(objA, objB) {
      var a = new Date(objA.publishTime);
      var b = new Date(objB.publishTime);
      return b - a;
    }
    arrs.sort(mySort);
  },

  turnToOliveAddPage: function() {
    util.pageJump.toOwnPage('olive_add/olive_add')
  },
  onLoad: function(options) {
    this.init();
  },
  onShow: function() {
    this.setData({
      user_id: app.globalData.userInfo._id
    })
    this.fetchOlives();
    util.setNavigationBarColor();
  },
  onPullDownRefresh: function() {
    this.fetchOlives();
  },
  onReachBottom: function() {

  }
})