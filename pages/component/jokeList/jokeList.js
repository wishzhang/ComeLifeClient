/**
 * 该组件为joke列表的展示
 * 父组件传入userid和isAll值来获取目标数据, isAll:1获取所有用户joke记录
 * 父组件监听childobj事件得到子组件实例
 * ->父组件在onLoad还没得到子组件实例，在onShow以后调用相关方法
 */
const WARN_EMPTY = '空空如也，~';
const WARN_ERROR = '数据响应失败~';
var app = getApp();
var util = require('../../../utils/util.js');

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    userid: {
      type: String,
      value: ''
    },
    isAll: {
      type: Number,
      value: 1
    }
  },
  data: {
    noMore: false,
    warn: {
      canSee: 'none',
      warnMsg: ''
    },
    allJokes: []
  },
  methods: {

    /**
     * 拉取jokes数据：{code:0,data:[{},{}],...
     */
    fetchData: function(url, params) {
      var _this = this;
      var localRes = util.request.getData({
        host: app.globalData.domain + url,
        params: params,
        success: function(res) {
          console.log(res);
          if (res.code === 0) {
            //过滤掉本地缓存已存在的记录，得到新增的记录
            var incJokes = [];
            for (var i = 0; i < res.data.length; i++) {
              var flag = true;
              for (var j = 0; j < localRes.data.length; j++) {
                if (localRes.data[j]._id === res.data[i]._id) {
                  flag = false;
                  break;
                }
              }
              if (flag) {
                incJokes.push(res.data[i]);
              }
            }
            console.log('incJokes:' + JSON.stringify(incJokes));
            console.log('incJokes.length:' + JSON.stringify(incJokes.length));
            _this.data.allJokes = _this.data.allJokes.concat(incJokes);
            _this.setData({
              warn: {
                canSee: 'none'
              },
              allJokes: _this.data.allJokes
            })
          } else if (res.code === 1) { //無記錄
            _this.setData({
              warn: {
                canSee: 'block',
                warnMsg: WARN_EMPTY
              },
              allJokes: []
            })
          } else if (res.code === 3) { //无更多
            _this.setData({
              noMore: true
            })
          } else { //服务器返回错误 code===2或...
            if (_this.data.allJokes.length !== 0) {
              _this.setData({
                warn: {
                  canSee: 'block',
                  warnMsg: WARN_ERROR
                }
              })
              wx.showToast({
                title: '服务器连接出错~',
              })
            } else {
              wx.showModal({
                content: '连接服务器出错,重新加载？',
                success: function (res) {
                  if (res.confirm) {
                    _this.fetchData(url, params);
                  } else {
                    _this.setData({
                      warn: {
                        canSee: 'block',
                        warnMsg: WARN_ERROR
                      }
                    })
                  }
                }
              })
            }
          }
        },
        fail: function() {
          if (_this.data.allJokes.length !== 0) {
            _this.setData({
              warn: {
                canSee: 'block',
                warnMsg: WARN_ERROR
              }
            })
            wx.showToast({
              title: '服务器连接出错~',
            })
          } else {
            wx.showModal({
              content: '连接服务器出错,重新加载？',
              success: function (res) {
                if (res.confirm) {
                  _this.fetchData(url, params);
                } else {
                  _this.setData({
                    warn: {
                      canSee: 'block',
                      warnMsg: WARN_ERROR
                    }
                  })
                }
              }
            })
          }
        },
        complete: function() {
          wx.hideLoading();
          wx.stopPullDownRefresh();
        }
      });
      //每次网络请求，先把缓存数据显示
      console.log('缓存：' + localRes.data);
      if (localRes.code === 0) {
        _this.setData({
          warn: {
            canSee: 'none'
          },
          allJokes: localRes.data
        })
      }
    },
    //仅负责获取第一页数据并刷新
    fetchFirstPage() {
      var _this = this;
      this.setData({
        noMore: false
      })
      this.data.allJokes = [];
      //page:1表示只获取第一页数据并刷新页面
      this.fetchData('/getJokesByPage', {
        page: 1,
        userID: this.data.userid,
        isAll: this.data.isAll
      });
    },
    //提供以下3个给父组件调用的方法
    refreshFirstPageByAuto: function() {
      wx.showLoading({
        title: '加载中...'
      });
      this.fetchFirstPage();
    },
    refreshFirstPageByPull: function() {
      this.fetchFirstPage();
    },
    refreshNextPage: function() {
      wx.showLoading({
        title: '加载中...'
      });
      //page:0表示获取下一页数据
      this.fetchData('/getJokesByPage', {
        page: 0,
        userID: this.data.userid,
        isAll: this.data.isAll
      });
    }
  },
  attached: function() {
    this.triggerEvent('childobj', this, {});
  }
})