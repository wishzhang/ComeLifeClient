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
    g:'c'
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },

  ready:function(){
    this.triggerEvent('myevent',{a:'abcd'},{});
  }
})
