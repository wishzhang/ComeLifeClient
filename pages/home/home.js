// pages/home/home.js
const WARN_EMPTY = '空空如也，~';
const WARN_ERROR = '数据响应失败,~';
var app = getApp();
var util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    noMore: false,
    warn: {
      canSee: 'none',
      warnMsg: ''
    },
    allJokes: []
  },
  /**拉取jokes数据：{code:0,data:[{},{}],...]
   * @url:相对路径，如/jokeGetAll
   * @params:Object,如{key:value}
   */
  fetchData: function(url, params) {
    var _this = this;
    wx.request({
      url: app.globalData.domain + url,
      data: params,
      success: function(res) {
        console.log('res:' + JSON.stringify(res.data));
        if (res.data.code === 0) {
          res.data.data = util.jokesConvertTime(res.data.data);
          _this.data.allJokes = _this.data.allJokes.concat(res.data.data);
          _this.setData({
            warn: {
              canSee: 'none'
            },
            allJokes: _this.data.allJokes
          })
        } else if (res.data.code === 1) { //無記錄
          _this.setData({
            warn: {
              canSee: 'block',
              warnMsg: WARN_EMPTY
            },
            allJokes: []
          })
        } else if (res.data.code === 3) { //无更多
          _this.setData({
            noMore: true
          })
        } else { //服务器返回错误 code===2或...
          wx.showModal({
            content: '服务器错误,重新加载？',
            success: function(res) {
              if (res.confirm) {
                _this.fetchData(url, params);
              } else {
                _this.setData({
                  warn: {
                    canSee: 'block',
                    warnMsg: WARN_ERROR
                  }
                })
              }
            }
          })
        }
      },
      fail: function() { //錯誤處理
        wx.showModal({
          content: '服务器错误,重新加载？',
          success: function (res) {
            if (res.confirm) {
              _this.fetchData(url, params);
            } else {
              _this.setData({
                warn: {
                  canSee: 'block',
                  warnMsg: WARN_ERROR
                }
              })
            }
          }
        })
      },
      complete: function() {
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  onShow: function() {
    wx.showLoading();
    this.fetchFirstPage();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showLoading();
    this.fetchData('/getJokesByPage');
  },
  onPullDownRefresh(){
    this.fetchFirstPage();
  },
  //仅负责获取第一页数据并刷新
  fetchFirstPage(){
    this.setData({
      noMore: false,
      warn: {
        canSee: 'none'
      },
      allJokes: []
    })
    this.fetchData('/getJokesByPage', {
      page: 1
    });
  }
})