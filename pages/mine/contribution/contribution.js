const util = require('../../../utils/util.js');
var child=null;
Page({
  data: {
  },
  onLoad:function(){
    util.setNavigationBarColor();
  },
  turnToJokeAddPage:function(){
    wx.navigateTo({
      url: '../jokeAdd/jokeAdd',
    })
  },
  onShow:function(){
    util.setNavigationBarColor();
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
  errHandler:function(){
    child.refreshOneUserData();
  }
})
