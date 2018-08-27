const util = require('../../../utils/util.js')
const app=getApp()
Page({
  data: {
    isLike:false,
    sentence:{}
  },
  onLoad: function (options) {
    var self=this;
    util.setNavigationBarColor();
    this.setData({
      defaultImg:'../../img/default.png',
      sentence:options
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
        user_id:util.getUserID()
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
         user_id: util.getUserID(),
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
        user_id: util.getUserID(),
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