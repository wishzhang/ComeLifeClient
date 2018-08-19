
const util = require('../../../utils/util.js');
var app=getApp();
Page({
  data: {
    navigateBarColor: util.getNavigationBarColor()
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
      url:app.globalData.domain+app.globalData.api.feedbackAdd,
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
    util.setNavigationBarColor();
    this.setData({
      navigateBarColor: util.getNavigationBarColor()
    })
  }
})