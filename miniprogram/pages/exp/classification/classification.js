// miniprogram/pages/exp/classification/classification.js
Page({

  data: {
    titleText:"名称走丢了~",
    explist:[],
  },
  onLoad: function (option) {
    var that = this;
    if (option.expMode!==undefined) {
      wx.cloud.callFunction({
        name: 'downLoadRe',
        data: {
          gather: 'Experiment',
          limitation: {
            expMode: option.expMode
          },
        },
      }).then(res => {
        that.setData({
          explist: res.result.data,
          titleText: option.expMode,
        })
      })
    } else {
      wx.cloud.callFunction({
        name: 'downLoadRe',
        data: {
          gather: 'Experiment',
          limitation: {
            expClass: option.expClass
          },
        },
      }).then(res => {
        that.setData({
          explist: res.result.data,
          titleText: option.expClass,
        })
      })
    }
  },
  onReady: function () {
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})