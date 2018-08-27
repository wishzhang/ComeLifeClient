/**
 * 聊天界面：通过请求图灵机器人API接口实现
 * 
 */

const util = require('../../../utils/util.js');
const storage=require('../../../common/storage.js')
const app = getApp();
//本次是否有进行聊天内容
let isStart=false; 
Page({
  data: {
    talkBgColor: storage.getNavigationBarColor().colorRgb(),
    scrollIntoView: 'scrollToHere',
    textAreaFocus: false,
    cursorSpacing: 10,//解决键盘与textarea之间的间隔问题
    value: '', //输入框内容
    talk: [], //对话内容
    navigateBarColor: storage.getNavigationBarColor()
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
    storage.setNavigationBarColor();
    this.setData({
      navigateBarColor: storage.getNavigationBarColor(),
      talkBgColor: storage.getNavigationBarColor().colorRgb()
    })
    this.updateFromCache();
  },
  pushTalk(talk){
    let t = this.data.talk
    t[t.length - 1].contents.push({
      roleType: talk.type,
      iconPath:talk.iconPath,
      values: {
        text: talk.value
      }
    });
  },
  setYourTalk:function (value) {
    this.pushTalk({
      type:0,
      iconPath: './beauty.png',
      value:value
    })
    this.setData({
      value: '',
      talk: this.data.talk
    })
    this.scrollToBottom();
  },
  updateYourTalk:function () {
    let that=this;
    wx.myRequest({
      url: app.url.talk,
      data: {
        text: this.data.value
      },
      method:'POST',
      success: function (res) {
        let r = res.data;
        if (r.code === 0) {
          let value = r.data.results[0].values.text;
          that.setYourTalk(value);
        } else if (r.code === 1) {
          wx.showMyToast({
            title: '服务器内部出错'
          })
        }
      }
    })
  },
  setMyTalk: function (value) {
    this.pushTalk({
      type: 1,
      iconPath: app.globalData.userInfo.avatarUrl || './portrait.png',
      value: value || '^_^'
    })
    this.setData({
      value: value,
      talk: this.data.talk
    })
    this.scrollToBottom();
  },
  send(){
    isStart=true;
    this.setMyTalk(this.data.value);
    this.updateYourTalk();
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
  updateFromCache() {
    let self = this;
    let talkCache = storage.getTalk();
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
    if (isStart) {
      storage.setTalk(this.data.talk)
      isStart=false;
    }
  },
  //监听事件
  tapStart: function (e) {
    this.send();
    this.readyInput();
  },
  bindInput: function(e) {
    this.setData({
      value: e.detail.value
    })
  },
  linechangeHandler: function (e) {
    let count = e.detail.lineCount;
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