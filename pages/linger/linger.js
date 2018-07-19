// pages/linger/linger.js
const util=require('../../utils/util.js')
const app=getApp();
Page({
  data: {
    errSee:false,
    myError: {},
    sentences:[]
  },
  fetchSentences:function(){
    var _this=this;
    _this.setData({
      errSee:false
    })
    wx.myRequest({
      url:app.globalData.domain+'/getSentences',
      method:'POST',
      success:function(res){
        var r=res.data;
        if(r.code===0){
          if(r.data.length===0){
            _this.setData({
              errSee:true,
              myError: util.errMsg.empty
            })
            return;
          }
          _this.setData({
            sentences:r.data,
            errSee:false
          })
        }else{
          _this.setData({
            errSee: true,
            myError: util.errMsg.error
          })
        }
      },
      fail:function(){
        _this.setData({
          errSee: true,
          myError: util.errMsg.error
        })
      }
    })
  },
  errHandler:function(){
    this.fetchSentences();
  },
  turnToTalkPage:function(){
    wx.navigateTo({
      url: 'talk/talk',
    })
  },
  turnToOlivePage:function(){
    wx.navigateTo({
      url: 'olive/olive',
    })
  },
  onLoad: function (options) {

  },
  onReady: function () {
  },
  onShow: function () {
    util.setNavigationBarColor();
    this.fetchSentences();
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
    this.fetchSentences();
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