// pages/component/errorRes/errorRes.js
Component({
  properties: {
    err: {
      type: Object,
      value:{
        img: '../../img/sorry.png',
        errText: '连接服务器出错~',
        btnText: '点我，重新加载'
      }
    }
  },
  data: {

  },
  methods: {
    errBtnTap: function() {
      this.setData({
        err:{}
      })
      this.triggerEvent('errBtn',this.data.err);
    }
  }
})