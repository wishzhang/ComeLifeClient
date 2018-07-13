var child=null;
Page({
  data: {
  },
  onLoad:function(){

  },
  turnToJokeAddPage:function(){
    wx.navigateTo({
      url: '../jokeAdd/jokeAdd',
    })
  },
  onShow:function(){
    child.refreshOneUserData();
  },
  onPullDownRefresh() {
    child.refreshOneUserData();
  },
  onReachBottom:function(){
  },
  //获取子组件对象jokeList
  fetchChild:function(e){
    child=e.detail;
  },
})
