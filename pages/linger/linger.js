// pages/linger/linger.js
const util=require('../../utils/util.js')
const app=getApp();
const login=require('../../common/login.js')
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
      url: app.globalData.domain + app.globalData.api.lingerSentence,
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
    util.pageJump.toCommonPage('sentenceDetail/sentenceDetail?' + params)
  },
  errHandler:function(){
    this.fetchSentences();
  },
  turnToTalkPage:function(){
    util.pageJump.toCommonPage('/pages/linger/talk/talk')
  },
  turnToOlivePage:function(){
    util.pageJump.toOwnPage('/pages/linger/olive/olive')
  },
  onLoad: function (options) {
    login.start();
  },
  onShow: function () {
    util.setNavigationBarColor();
    this.fetchSentences();
  },
  onPullDownRefresh: function () {
    this.fetchSentences();
  },
  onReachBottom: function () {
    wx.showMyToast({
      title:'没有更多句子了~'
    })
  }
})