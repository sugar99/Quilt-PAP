// miniprogram/pages/exp/professionalClassification/professionalClassification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    professionalClassification: [
      { text: "人格", iconPath: '' },
      { text: "消费/决策", iconPath: '' },
      { text: "面孔", iconPath: '' },
      { text: "发展", iconPath: '' },
      { text: "阅读/学习/记忆", iconPath: '' },
      { text: "视知觉/眼动", iconPath: '' },
      { text: "空间信息", iconPath: '' },
      { text: "其他", iconPath: '' }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  professionalClassification: function (e) {
    var expClass = e.currentTarget.dataset.value;
    console.log(e.currentTarget.dataset.value);
    wx.navigateTo({
      url: '../classification/classification?expClass=' + expClass,
    });
  }, 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
