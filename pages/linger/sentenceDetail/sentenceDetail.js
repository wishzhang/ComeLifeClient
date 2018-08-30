const util = require('../../../utils/util.js')
const storage=require('../../../common/storage.js')
const app=getApp()
Page({
  data: {
    isLike:false,
    sentence:{},
    canuse:false
  },
  onLoad: function (options) {
    this.showShareMenu();
    var self=this;
    storage.setNavigationBarColor();
    this.setData({
      defaultImg:'../../img/default.png',
      sentence:options,
      canuse: app.globalData.canuse
    },function(){
      self.initLike()
    })
  },
  onReady: function () {
  
  },
  onShow: function () {

  },
  showShareMenu(){
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  initLike(){
    var self=this;
    app.req.getLike({
      user_id: storage.getUserID()
    },function(err,r){
      if(err){
        return;
      }
      if (r.code === 0) {
        let likes = r.data.likes;
        let isLike = self.hasValueOfKey(likes, '_id', self.data.sentence._id)
        self.setData({
          isLike: isLike
        })
      }
    })
  },
  hasValueOfKey(arr,key,value){
    for(let i=0;i<arr.length;i++){
      let obj=arr[i];
      if(obj[key]===value){
        return true;
      }
    }
    return false;
  },
  switchIsLike() {
    this.setData({
      isLike: !this.data.isLike
    })
  },
  //监听事件
  tapAddLike(e){
    let self=this;
    app.req.addLike({
      user_id: storage.getUserID(),
      sentence_id: this.data.sentence._id
    },function(err,r){
      if(err){
        return;
      }
      if (r.code === 0) {
        self.switchIsLike();
      } else {
        wx.showMyToast({
          title: '添加出错'
        })
      }
    })
  },
  tapDelLike(){
    let self=this;
    app.req.delLike({
      user_id: storage.getUserID(),
      sentence_id: this.data.sentence._id
    },function(err,r){
      if (r.code === 0) {
        self.switchIsLike();
      } else {
        wx.showMyToast({
          title: '删除出错'
        })
      }
    })
  },
  bindError(e){
    console.log(e)
    wx.showMyToast({
      title:'转发失败，请检查网络连接~'
    })
  }
})