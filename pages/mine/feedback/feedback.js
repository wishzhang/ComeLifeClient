
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

    app.req.addFeedback(data,function(err,r){
      if(err){
        wx.showMyToast({
          title: '提交失败~'
        })
        return;
      }
      if (r.code === 0) {
        wx.showMyToast({
          title: '提交成功',
          icon: 'success'
        })
      } else if (r.code === 1) {
        wx.showMyToast({
          title: '提交失败~'
        })
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