const util = require('../../../utils/util.js')
const storage=require('../../../common/storage.js')
const app = getApp();

Page({
  data: {
    errSee: false,
    myError: {},
    sentences: []
  },
  onLoad: function(options) {

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
      url: app.url.getMyLikes,
      data:{
        user_id: storage.getUserID()
      },
      success: function(res) {
        var r = res.data;
        if (r.code === 0) {
          if (r.data.likes.length === 0) {
            _this.setEmpty();
            return;
          }
          _this.setData({
            sentences: r.data.likes,
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
    util.pageJump.toCommonPage('/pages/linger/sentenceDetail/sentenceDetail?' + params)
  },
  errHandler: function() {
    this.fetchSentences();
  }
})