var child=null;
var app=getApp();
Page({
  data: {
    userid: ''
  },
  onLoad:function(){
    this.setData({
      userid:app.globalData.userInfo.nickName
    })
  },
  turnToJokeAddPage:function(){
    wx.navigateTo({
      url: '../jokeAdd/jokeAdd',
    })
  },
  onShow:function(){
    child.refreshFirstPageByAuto();
  },
  onPullDownRefresh() {
    child.refreshFirstPageByPull();
  },
  onReachBottom:function(){
    child.refreshNextPage();
  },
  //获取子组件对象jokeList
  fetchChild:function(e){
    child=e.detail;
  },
})
