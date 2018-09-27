// pages/joke/joke.js
const app=getApp()

Page({

  data: {
    //页面笑话内容
    content:'',
    //笑话容器
    jokes:[],
    //当前笑话在jokes的位置
    currentJokeIndex:0,
    //当前获取的页索引
    currentPageIndex:1,
    //内容显示透明度
    contentOpacity:1
  },

  setContent(content){
    this.setData({
      content:content
    })
  },

  hideContent(fun){
    let that=this
    this.setData({
      contentOpacity: 0
    },function(){
      setTimeout(function(){
        fun.call(that)
      },1000)
    })
  },
  
  showContent() {
    let that=this
    setTimeout(function(){
      that.setData({
        contentOpacity: 1
      })
    })
  },

//显示内容错误信息
  showErrorContent(){
    this.setData({
      content: '没有下一条了喔。祝您眉目舒展，体健心安(^_^)'
    })
  },

  toInitJoke(){
    this.toNextJoke()
  },

//下一条按钮点击事件
  toNextJokeTap() {
    console.log('to next')
    this.toNextJoke()
  },

  toNextJoke(){
    let that = this
    //隐藏内容后再到下一条
    this.hideContent(function(){
      if (this.data.currentJokeIndex < this.data.jokes.length - 1) {
        that.data.currentJokeIndex++
        that.setContent(that.data.jokes[that.data.currentJokeIndex].content)
        that.showContent()
      } else {
        this.updateNextPageJokes(function () {
          that.showContent()
        }, function () {
          that.data.currentJokeIndex = 0
          that.setContent(that.data.jokes[that.data.currentJokeIndex].content)
        })
      }
    })
  },

//每调用就将jokes全更新，fun1一定立刻执行，fun2当获取到数据执行
  updateNextPageJokes(fun1,fun2) {
    fun1()
    let that = this
    app.req.getJoke({
      page: this.data.currentPageIndex,
      pagesize: 15,
      sort: 'asc',
      time: Math.round(new Date().getTime() / 1000-99999).toString()
    }, function (err,res) {
      if (err) {
        that.showErrorContent()
        return
      }
      if (res.error_code === 0&&res.result.data.length) {
        that.setData({
          currentPageIndex:that.data.currentPageIndex+1,
          jokes: res.result.data
        },function(){
          fun2()
        })
      } else {
        that.showErrorContent()
        console.log('error:' + JSON.stringify(res))
      }
    })
  },

//转发失败
  bindError(e) {
    console.log(e)
    wx.showMyToast({
      title: '转发失败，请检查网络连接~'
    })
  },

  onLoad: function (options) {
    this.toInitJoke()
  }
})