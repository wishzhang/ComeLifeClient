
const util = require('../../../utils/util.js');
const storage=require('../../../common/storage.js')
const app=getApp();
Page({
  data: {
    navigateBarColor: storage.getNavigationBarColor()
  },

  formSubmit:function(e){
    var data=e.detail.value;
    data.user_id=app.globalData.userInfo._id;
    if(data.content.trim()==''){
      wx.showMyToast({
        title: '请输入您的建议~'
      })
      return;
    }
    wx.myRequest({
      url:app.url.feedbackAdd,
      data:data,
      method:'POST',
      success:function(res){
        var r=res.data;
        if(r.code===0){
          wx.showMyToast({
            title:'提交成功',
            icon:'success'
          })
        }else if(r.code===1){
          wx.showToast({
            title: '提交失败~'
          })
        }
      },
      fail:function(){
        wx.showMyToast({
          title: '提交失败~'
        })
      },
      complete:function(){

      }
    })
  },
  onShow: function () {
    storage.setNavigationBarColor();
    this.setData({
      navigateBarColor: storage.getNavigationBarColor()
    })
  }
})