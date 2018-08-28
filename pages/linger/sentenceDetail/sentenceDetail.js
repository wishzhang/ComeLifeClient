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
    var self=this;
    storage.setNavigationBarColor();
    this.setData({
      defaultImg:'../../img/default.png',
      sentence:options,
      canuse: app.globalData.canuse
    },function(){
      self.getMyLikes()
    })
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
  getMyLikes(){
    var self=this;
    wx.myRequest({
      url:app.url.getMyLikes,
      data:{
        user_id: storage.getUserID()
      },
      success(res){
        let r=res.data;
        if(r.code===0){
          let likes=r.data.likes;
          let isLike = self.hasValueOfKey(likes, '_id', self.data.sentence._id)
          self.setData({
            isLike:isLike
          })
        }
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
     wx.myRequest({
       url:app.url.addLike,
       data:{
         user_id: storage.getUserID(),
         sentence_id:this.data.sentence._id
       },
       success:function(res){
         let r=res.data;
         if(r.code===0){
           self.switchIsLike();
         }else{
           wx.showMyToast({
             title:'添加出错'
           })
         }
       }
     })
  },
  tapDelLike(){
    let self=this;
    wx.myRequest({
      url: app.url.delLike,
      data: {
        user_id: storage.getUserID(),
        sentence_id: this.data.sentence._id
      },
      success: function (res) {
        let r = res.data;
        if (r.code === 0) {
          self.switchIsLike();
        }else{
          wx.showMyToast({
            title: '删除出错'
          })
        }
      }
    })
  }
})