// pages/home/home.js
const WARN_EMPTY = '空空如也，~';
const WARN_ERROR = '数据响应失败,~';
const WARN_WAIT = '正在请求数据...';
var app = getApp();
var util=require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    warn: {
      canSee: 'block',
      warnMsg: WARN_WAIT
    },
    params:{
      userID: ''
    },
    allJokes: []
  },
  turnToAddPage:function(){
    wx.navigateTo({
      url: '../jokeAdd/jokeAdd',
    })
  },
  fetchData: function () {
    var _this = this;
    wx.request({
      // url:'http://localhost:8080/cltest/home/homesuccess.json',
      url: app.globalData.domain + '/jokeGet',
      data:this.data.params,
      success: function (res) {
        if (res.data.code === 0) {
          res.data.data = util.jokesConvertTime(res.data.data);
          _this.setData({
            warn: {
              canSee: 'none'
            },
            allJokes: res.data.data
          })
        } else if (res.data.code === 1) {//無記錄
          _this.setData({
            warn: {
              canSee: 'block',
              warnMsg: WARN_EMPTY
            },
            allJokes: []
          })
        } else {      //服务器返回错误 code===2或...
          _this.setData({
            warn: {
              canSee: 'block',
              warnMsg: WARN_ERROR
            },
            allJokes: []
          })
        }
      },
      fail: function () {//錯誤處理
        _this.setData({
          warn: {
            canSee: 'block',
            warnMsg: WARN_ERROR
          },
          allJokes: []
        })
      },
      complete: function () {
        wx.stopPullDownRefresh();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      params:{
        userID: app.globalData.userInfo.nickName
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.startPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.fetchData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})