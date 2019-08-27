// miniprogram/pages/meg/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    explist: [{
        name: "文字识别任务",
        imagePath: "",
        score: 9.0,
        reward: 10,
        expTime: 20,
        distance: 0.5,
        footTime: 8,
        place: "中大心理系楼C403",
        abstract: "实验超级简单，主试人超好，欢迎大家来报名呀!!!",
        comments: ["高报酬", "实验时证明", "有趣", "有零食"],
        requirement: ["男", "视力正常", "右利手", "在校大学生", "非心理系"],
        time1:"7.8",
        time2:["13:40-13:45"]
    }, {
        name: "文字识别任务",
        imagePath: "",
        score: 9.0,
        reward: 10,
        expTime: 20,
        distance: 0.5,
        footTime: 8,
        place: "中大心理系楼C403",
        abstract: "实验超级简单，主试人超好，欢迎大家来报名呀!!!",
        comments: ["高报酬", "实验时证明", "有趣", "有零食"],
        requirement: ["男", "视力正常", "右利手", "在校大学生", "非心理系"],
        time1: "7.8",
        time2: ["13:40-13:45"]
      },
      {
        name: "文字识别任务",
        imagePath: "",
        score: 9.0,
        reward: 10,
        expTime: 20,
        distance: 0.5,
        footTime: 8,
        place: "中大心理系楼C403",
        abstract: "实验超级简单，主试人超好，欢迎大家来报名呀!!!",
        comments: ["高报酬", "实验时证明", "有趣", "有零食"],
        requirement: ["男", "视力正常", "右利手", "在校大学生", "非心理系"],
        time1: "7.8",
        time2: ["13:40-13:45"]
      }
    ]
  },
  publishExp: function () {
    wx.navigateTo({
      url: '../me/publish/publish',
    })
  },
  check: function () {
    wx.navigateTo({
      url: 'Expshenhe/Expshenhe',
    })
  },
  onLoad: function (options) {
    var privilege = getApp().globalData.privilege
    this.setData({
      privilege: privilege
    })
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