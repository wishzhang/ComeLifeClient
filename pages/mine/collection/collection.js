// pages/mine/collection/collection.js
const util=require('../../../utils/util.js');
var child = null;
var app = getApp();
Page({
  data: {
  },
  onLoad: function () {
  },
  onShow: function () {
    util.setNavigationBarColor();
    child.refreshCollectionData();
  },
  onPullDownRefresh() {
    child.refreshCollectionData();
  },
  onReachBottom: function () {
  },
  //获取子组件对象jokeList
  fetchChild: function (e) {
    child = e.detail;
  },
})
