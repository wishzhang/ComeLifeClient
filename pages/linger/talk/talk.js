/**
 * 聊天界面：通过请求图灵机器人API接口实现
 * 
 * 单例模式采用全局变量 session;
 * 
 */
var session;
const util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    talkBgColor: util.getNavigationBarColor().colorRgb(),
    scrollIntoView: 'scrollToHere',
    textAreaFocus: false,
    cursorSpacing: 10,//解决键盘与textarea之间的间隔问题
    value: '', //输入框内容
    talk: [], //对话内容
    navigateBarColor: util.getNavigationBarColor()
  },
  onLoad: function (options) {
    this.init();
  },
  onReady() {
    //如果初始页面textarea聚焦因过早调用失效了，这里重新调用
    this.readyInput();
  },
  onUnload: function () {
    this.saveToCache();
  },
  init: function() {
    this.updateFromCache();
    util.setNavigationBarColor();
    this.setData({
      navigateBarColor: util.getNavigationBarColor(),
      talkBgColor: util.getNavigationBarColor().colorRgb()
    })
    session = this.session();
  },
  yourTalk: function() {
    var _this = this;
    var setYourTalk = function(v) {
      var t = _this.data.talk
      t[t.length - 1].contents.push({
        roleType: 0,
        iconPath: './beauty.png',
        values: {
          text: v
        }
      });
      _this.setData({
        value: '',
        talk: _this.data.talk
      })
      _this.scrollToBottom();
    };
    var updateYourTalk = function() {
      wx.myRequest({
        url: app.globalData.domain + '/talk',
        data: {
          text: _this.data.value
        },
        method: 'POST',
        success: function(res) {
          var r = res.data;
          if (r.code === 0) {
            var value = r.data.results[0].values.text;
            setYourTalk.call(_this, value);
          } else if (r.code === 1) {
            wx.showMyToast({
              title: '服务器内部出错'
            })
          }
        }
      })
    };
    return {
      setYourTalk: setYourTalk,
      updateYourTalk: updateYourTalk
    }
  },
  myTalk: function() {
    var _this = this;
    var setMyTalk = function(value) {
      value = value || '^_^'
      var t = _this.data.talk
      t[t.length - 1].contents.push({
        roleType: 1,
        iconPath: app.globalData.userInfo.avatarUrl || './portrait.png',
        values: {
          text: value
        }
      });
      _this.setData({
        value: value,
        talk: _this.data.talk
      })
      _this.scrollToBottom();
    }
    return {
      setMyTalk: setMyTalk
    }
  },
  session: function() {
    var _this = this;
    //当isStart为true则保存本次对话记录到本地
    var isStart = false;
    var hasStart = function() {
      return isStart;
    }

    var start = function() {
      var myTalk = _this.myTalk();
      var yourTalk = _this.yourTalk();
      myTalk.setMyTalk(_this.data.value);
      yourTalk.updateYourTalk();
      isStart = true;
    };
    return {
      start: start,
      hasStart: hasStart
    }
  },
  readyInput(){
    this.setData({
      scrollIntoView: 'scrollToHere',
      textAreaFocus: true
    })
  },
  scrollToBottom() {
    this.setData({
      scrollIntoView: 'scrollToHere'
    })
  },
  pullKeyBoard() {
    this.setData({
      textAreaFocus: true
    })
  },
  updateFromCache() {
    var self = this;
    var talkCache = util.getCache(app.globalData.key.TALK);
    //TODO: 提高页面流畅度，最好按需加载显示，这里采取的是只显示talk数组的后15条数据。
    talkCache = talkCache.slice(-10);
    if (talkCache) {
      talkCache.push({
        time: util.formatTime(new Date()),
        contents: []
      })
      this.setData({
        talk: talkCache
      }, function () {
        self.readyInput();
      })
    } else {
      this.setData({
        talk: [{
          time: util.formatTime(new Date()),
          contents: [{
            roleType: 0,
            iconPath: './beauty.png',
            values: {
              text: '嗨，原来你也在这里~'
            }
          }]
        }]
      })
    }
  },
  saveToCache() {
    if (session.hasStart()) {
      util.setCache(app.globalData.key.TALK, this.data.talk)
    }
  },
  //监听事件
  tapStart: function (e) {
    session.start();
    this.readyInput();
  },
  bindInput: function(e) {
    this.setData({
      value: e.detail.value
    })
  },
  linechangeHandler: function (e) {
    var count = e.detail.lineCount;
    if (count < 3) {
      this.setData({
        cursorSpacing: 10
      })
    } else {
      this.setData({
        cursorSpacing: 0
      })
    }
  }
})