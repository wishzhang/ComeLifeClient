var child = null;
Page({
  onShow: function () {
    child.refreshFirstPageByAuto();
  },
  onPullDownRefresh() {
    child.refreshFirstPageByPull();
  },
  onReachBottom: function () {
    child.refreshNextPage();
  },
  //获取子组件对象jokeList
  fetchChild: function (e) {
    child = e.detail;
  },
})