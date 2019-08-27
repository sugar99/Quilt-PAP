// miniprogram/pages/me/edit/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    lengthLeft:0,
    content:'',
    type:'text'
  },
  submit:function(){
    if(this.data.lengthLeft<0){
      wx.showToast({
        title: '文本过长,已截取',
        icon:'none',
        duration:2000,
      })
      this.setData({
        content: this.data.content.slice(0, this.data.lengthLimit)
      })
    }
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        currentInputTitle : this.data.index,
        currentInputContent: this.data.content,
    })
    setTimeout(() => {
        wx.navigateBack({
          detal: 1,
        });
      }, 1500
    );      
    },
  changed:function(e){
    this.setData({
      content: e.detail.value,
      lengthLeft: this.data.lengthLimit - e.detail.value.length,
    })
  },
  onLoad: function (options) {
    var that = this;
    var item = JSON.parse(options.parameter);
    that.setData({
      lengthLimit: item.lengthlimit,
      lengthLeft: item.lengthlimit,
      title: item.title,
      index: item.index,
      value: item.value,
    })
    if (item.lengthlimit < 5) {
      this.setData({
        type: 'number',
      })
    }
    if (item.value !== '未编辑' && item.value !== '未选择' && item.value !== '无要求'){
      this.setData({
        content: this.data.value,
        lengthLeft: item.lengthlimit-item.value.length,
      })
    }

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },oad: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})