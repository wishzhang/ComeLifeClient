// pages/linger/talk/talk.js
/**
 * bug:<hr>,输入框
 * 聊天界面：通过请求图灵机器人API接口实现
 */
const util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    talkBg: app.globalData.domain +'/images/talk_bg.png',
    scrollIntoView:'scrollToHere',
    contentHeight:0,
    textAreaFocus: true,
    cursorSpacing: 10,
    value: '',
    talk: [],
    navigateBarColor: util.getNavigationBarColor()
  },
  obj: {},
  yourTalk: function() {
    var _this = this;
    var params = {
      "perception": {
        "inputText": {
          "text": '^_^'
        },
        "selfInfo": {
          "location": {
            "city": app.globalData.userInfo.city,
            "province": app.globalData.userInfo.province
          }
        }
      },
      "userInfo": {
        "apiKey": app.globalData.talkInfo.apiKey,
        "userId": '123456'
      }
    };
    var setYourTalk = function(v) {
      var t = _this.data.talk
      t[t.length - 1].contents.push({
        roleType: 0,
        iconPath: './tuling.png',
        values: {
          text: v
        }
      });
      _this.setData({
        value: '',
        talk: _this.data.talk
      })
      _this.setData({
        scrollIntoView: 'scrollToHere'
      })
    };
    var updateYourTalk = function() {
      var _this = this;
      wx.request({
        url: app.globalData.domain + '/talk',
        data: {
          text: _this.obj.yourTalk.params.perception.inputText.text
        },
        method: 'POST',
        success: function(res) {
          var r = res.data;
          console.log(JSON.stringify(r));
          if (r.code === 0) {
            var value = r.data.results[0].values.text;
            setYourTalk.call(_this, value);
            _this.relativeTextareaValue.apply(_this);
          } else if (r.code === 1) {
            wx.showToast({
              title: '服务器内部出错',
              icon: 'none',
              duration: 3000
            })
          }
        },
        fail: function() {
          wx.showToast({
            title: '连接服务器出错',
            icon: 'none',
            duration: 3000
          })
        }
      })
    };
    return {
      params: params,
      setYourTalk: setYourTalk,
      updateYourTalk: updateYourTalk
    }
  },
  myTalk: function() {
    var _this = this;
    var setMyTalk = function() {
      var t = _this.data.talk
      t[t.length - 1].contents.push({
        roleType: 1,
        iconPath: app.globalData.userInfo.avatarUrl || './portrait.png',
        values: {
          text: _this.obj.yourTalk.params.perception.inputText.text
        }
      });
      _this.setData({
        talk: _this.data.talk
      })
      _this.setData({
        scrollIntoView: 'scrollToHere'
      })
    }
    return {
      setMyTalk: setMyTalk
    }
  },
  session: function() {
    var _this = this;
    var isStart = false;
    var hasStart = function() {
      return isStart;
    }
    var start = function() {
      var myTalk = _this.obj.myTalk;
      var yourTalk = _this.obj.yourTalk;
      myTalk.setMyTalk.apply(_this);
      yourTalk.updateYourTalk.apply(_this);
      isStart = true;
    };
    return {
      start: start,
      hasStart: hasStart
    }
  },
  relativeTextareaValue: function(e) {
    if (!e) {
      this.obj.yourTalk.params.perception.inputText.text = '^_^';
      return;
    }
    if (e.detail.value == '') {
      this.obj.yourTalk.params.perception.inputText.text = '^_^';
      return;
    }
    this.obj.yourTalk.params.perception.inputText.text = e.detail.value;
  },

  //obj对象用来管理其他对象
  onLoad: function(options) {
    this.obj.myTalk = this.myTalk();
    this.obj.yourTalk = this.yourTalk();
    this.obj.session = this.session();

    //读取缓存
    var talkCache = util.getCache(app.globalData.key.TALK);
    if (talkCache) {
      //每次进来为一次会话
      talkCache.push({
        time: util.formatTime(new Date()),
        contents: []
      })
      this.setData({
        talk: talkCache
      })
    }else{
      this.setData({
        talk:[{
          time: util.formatTime(new Date()),
          contents: []
        }]
      })
    }
  },
  onUnload: function() {
    //存储缓存
    if (this.obj.session.hasStart()) {
      util.setCache(app.globalData.key.TALK, this.data.talk)
    }
  },
  onShow: function() {
    util.setNavigationBarColor();
    this.setData({
      navigateBarColor: util.getNavigationBarColor()
    })

    console.log('contentHeight:'+this.calContentHeight())
    var _this=this;
    this.setData({
      contentHeight:this.calContentHeight(),
    },function(){
      _this.setData({
        scrollIntoView: 'scrollToHere'
      })
    })
  },
  tapStart: function() {
    this.obj.session.start.apply(this);
    this.setData({
      textAreaFocus: true
    })
  },
  linechangeHandler: function(e) {
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
  },
  //计算对话框高度,这个貌似不起作用啊
  calContentHeight: function() {
    var talks = this.data.talk;
    var l=0;
    l+=76*talks.length;
    for (var i = 0; i < talks.length; i++) {
      var contents = talks[i].contents;
      var cl = contents.length * 130;
      l += cl;
    }

    //当计算小于除footer外的高度时，另height填充
    return l;
  }
})