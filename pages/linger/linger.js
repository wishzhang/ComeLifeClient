const util = require('../../utils/util.js')
const storage=require('../../common/storage.js')
const app = getApp();
const login = require('../../common/login.js')

Page({
  data: {
    errSee: false,
    myError: {},
    sentences: []
  },
  onLoad: function(options) {
    login.start();
  },
  onShow: function() {
    storage.setNavigationBarColor();
    this.fetchSentences();
  },
  onPullDownRefresh: function() {
    this.fetchSentences();
  },
  onReachBottom: function() {
    wx.showMyToast({
      title: '没有更多句子了~'
    })
  },
  fetchSentences: function() {
    var _this = this;
    _this.setData({
      errSee: false
    })
    wx.myRequest({
      url: app.url.lingerSentence,
      method: 'POST',
      success: function(res) {
        var r = res.data;
        if (r.code === 0) {
          if (r.data.length === 0) {
            _this.setEmpty();
            return;
          }
          _this.setData({
            sentences: r.data,
            errSee: false
          })
        } else {
          _this.setErr();
        }
      },
      fail: function() {
        _this.setErr();
      }
    })
  },
  setEmpty(){
    this.setData({
      errSee: true,
      myError: util.errMsg.empty
    })
  },
  setErr(){
    this.setData({
      errSee: true,
      myError: util.errMsg.error
    })
  },
  //事件监听
  tapToSentenceDetail: function(e) {
    var item = e.currentTarget.dataset.item;
    var params = util.formatToParams(item);
    util.pageJump.toCommonPage('sentenceDetail/sentenceDetail?' + params)
  },
  errHandler: function() {
    this.fetchSentences();
  },
  turnToTalkPage: function() {
    util.pageJump.toCommonPage('/pages/linger/talk/talk')
  },
  turnToOlivePage: function() {
    util.pageJump.toOwnPage('/pages/linger/olive/olive')
  }
})