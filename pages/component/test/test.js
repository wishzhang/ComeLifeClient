// pages/component/test/test.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    arr:['a','b','c'],
    g:'c',
    myError: {
      img: '../../img/sorry.png',
      errText: '连接服务器出错~',
      btnText: '点我，重新加载'
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    errHandler:function(){
      wx.showToast({
        title: 'hi~',
        icon:'none'
      })
    }
  },

  ready:function(){
  }
})
