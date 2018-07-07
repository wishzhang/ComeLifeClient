/**
 * 该组件为joke列表的展示
 * 父组件传入userid和isAll值来获取目标数据, isAll:1获取所有用户joke记录
 * 父组件监听childobj事件得到子组件实例
 * ->父组件在onLoad还没得到子组件实例，在onShow以后调用相关方法
 */
const WARN_EMPTY = '空空如也，~';
const WARN_ERROR = '数据响应失败,~';
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
    isAll:{
      type:Number,
      value:1
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

    /**拉取jokes数据：{code:0,data:[{},{}],...]
     * @url:相对路径，如/jokeGetAll
     * @params:Object,如{key:value}
     */
    fetchData: function(url, params) {
      var _this = this;
      wx.request({
        url: app.globalData.domain + url,
        data: params,
        header:{
          token: app.globalData.token
        },
        success: function(res) {
          app.globalData.token = res.header.token;
          if (res.data.code === 0) {
            res.data.data = util.jokesConvertTime(res.data.data);
            _this.data.allJokes = _this.data.allJokes.concat(res.data.data);
            _this.setData({
              warn: {
                canSee: 'none'
              },
              allJokes: _this.data.allJokes
            })
          } else if (res.data.code === 1) { //無記錄
            _this.setData({
              warn: {
                canSee: 'block',
                warnMsg: WARN_EMPTY
              },
              allJokes: []
            })
          } else if (res.data.code === 3) { //无更多
            _this.setData({
              noMore: true
            })
          } else { //服务器返回错误 code===2或...
            wx.showModal({
              content: '服务器错误,重新加载？',
              success: function(res) {
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
        fail: function() { //錯誤處理
          wx.showModal({
            content: '服务器错误,重新加载？',
            success: function(res) {
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
        },
        complete: function() {
          wx.hideLoading();
          wx.stopPullDownRefresh();
        }
      })
    },
    //仅负责获取第一页数据并刷新
    fetchFirstPage() {
      var _this = this;
      this.setData({
        noMore: false,
        warn: {
          canSee: 'none'
        },
        allJokes: []
      })
      //page:1表示只获取第一页数据并刷新页面
      this.fetchData('/getJokesByPage', {
        page: 1,
        userID: this.data.userid,
        isAll: this.data.isAll
      });
    },
    //提供以下3个给父组件调用的方法
    refreshFirstPageByAuto: function() {
      wx.showLoading();
      this.fetchFirstPage();
    },
    refreshFirstPageByPull: function() {
      this.fetchFirstPage();
    },
    refreshNextPage: function() {
      wx.showLoading();
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