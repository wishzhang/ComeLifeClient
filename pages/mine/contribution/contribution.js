// pages/mine/contribution/contribution.js
Page({
  turnToAddPage:function(){
    wx.navigateTo({
      url:'../jokeAdd/jokeAdd'
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    jokes:[{
      jokeID:1,
      jokeContent:'this is joke1',
      publishTime:'7月4号'
    }, {
      jokeID:2,
      jokeContent: 'this is joke2',
      publishTime: '7月4号'
      }, {
        jokeID: 3,
        jokeContent: 'this is joke3',
        publishTime: '7月4号'
    }, {
      jokeID: 1,
      jokeContent: 'this is joke1',
      publishTime: '7月4号'
    }, {
      jokeID: 2,
      jokeContent: 'this is joke2',
      publishTime: '7月4号'
    }, {
      jokeID: 3,
      jokeContent: 'this is joke3',
      publishTime: '7月4号'
    }, {
      jokeID: 1,
      jokeContent: 'this is joke1',
      publishTime: '7月4号'
    }, {
      jokeID: 2,
      jokeContent: 'this is joke2',
      publishTime: '7月4号'
    }, {
      jokeID: 3,
      jokeContent: 'this is joke3',
      publishTime: '7月4号'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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