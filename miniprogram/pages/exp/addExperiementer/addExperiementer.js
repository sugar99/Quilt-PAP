// miniprogram/pages/addExperiementer/addExperiementer.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordId: "",
    school: "",
    organization: "",
    unitList: [],

  },
  getDate: function (e) {
    this.setData({ school: e.detail })
  },
  getDate1: function (e) {
    this.setData({ organization: e.detail })
  },
  formSubmit: function (e) {
    var that = this;
    var school = this.data.school;
    var organization = this.data.organization;
    var sid = e.detail.value.sid;
    var jihuo = e.detail.value.jihuo;
    var id = app.globalData.openid;
    console.log(this.data.school, this.data.organization, sid, jihuo, id)
    const db = wx.cloud.database()
    db.collection('Privilege_list').get({
      success: function (res) {
        for (var i = 0; i < res.data.length; i++) {
          if (sid == res.data[i].sid && jihuo == res.data[i].jihuo && school == res.data[i].school && organization == res.data[i].organization)
            db.collection('Participant').doc(id)
              .update({
                data: {
                  privilege: true
                },
                success: function (res) {
                  console.log(res.data)
                }
              })
        }
      }
    })
  },
  help: function () {
    const db = wx.cloud.database()
    console.log('被点击')
    db.collection('Experiementer').doc('80231366-3f0b-46bd-b9ff-b096933ec9b5').get({
      success: function (res) {
        console.log(res.data)
      }
    })

  },
  onLoad: function (options) {

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

  },

})