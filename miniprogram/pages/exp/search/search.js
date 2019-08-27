// miniprogram/pages/exp/search/search.js
Page({
  data: {
    clearShow: false, // 动态显示清除图标
    searchContent: '',
    history:true,
    tips: true, 
    result: false,
    reTipsItem:["脑电","决策"],
    hisTipsItem: ["你是沙雕", "行为感知实验", "关于大学生面临压力下的购买决策研究"],
  },
  clearHistory: function (e) {
    this.setData({
      history: "false",
    });
  },
  myTap: function (e){
    this.setData({
      result: true,
      tips: false,
      searchContent: e.target.dataset.value,
    });
  },
  search: function (e) {
    if (e.detail.value.length > 0 ) {
      this.setData({
        result: true,
        tips: false,
        searchContent: e.detail.value
      });
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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