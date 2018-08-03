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
  tapToSentenceDetail:function(e){
    var item=e.currentTarget.dataset.item;
    var params='';
    for(var key in item){
      if(item.hasOwnProperty(key)){
        params+=key+'='+item[key];
      }
      params+='&';
    }
    params=params.substr(0,params.length-1);
    wx.navigateTo({
      url: 'sentenceDetail/sentenceDetail?'+params,
    })
  },
  errHandler:function(){
    this.fetchSentences();
  },
  turnToTalkPage:function(){
    wx.navigateTo({
      url: '/pages/linger/talk/talk',
    })
  },
  turnToOlivePage:function(){
    if(!app.globalData.canuse){
      wx.switchTab({
        url: '/pages/mine/mine',
        complete:function(){
          wx.showToast({
            title: '请先授权登录^_^',
            icon: 'none'
          })
        }
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/linger/olive/olive',
    })
  },
  turnToTrackPage:function(){
    wx.showToast({
      title: '小Z在开发中^_^...',
      icon:'none',
      duration:3000
    })
  },
  turnToDoubtPage:function(){
    wx.showToast({
      title: '小Z在开发中^_^...',
      icon: 'none',
      duration: 3000
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