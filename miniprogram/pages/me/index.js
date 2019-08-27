// miniprogram/pages/me/index.js
const app = getApp();
Page({
  data: {
    avatarUrl: '/images/PAP1.png',
    logIn: false,
    privilege:false,
    imageList: [
      '/images/news1.png',
      '/images/news0.png',
      '/images/male1.png',
      '/images/female1.png',
      '/images/go1.png', 
      '/images/go0.png', 
    ],
    linkList:[
      [
        {
        text:'主试认证',
        privilege: false,
        linkPath:'certificate/certificate',
        imagePath:{
          logIn: '/images/certification1.png', //认证图标
          logOut: '/images/certification0.png', 
        }},
      ],
      [
        {
        text: '评价星级',
          privilege: false,
        linkPath: 'evaluation/evaluation',
        imagePath: {
          logIn: '/images/evaluation1.png', //评价星级图标
          logOut: '/images/evaluation0.png', 
        }},
      {
        text: '参与过的实验',
        privilege: false,
        linkPath: 'participated/participated',
        imagePath: {
          logIn: '/images/participated1.png', //参与过图标
          logOut: '/images/participated0.png', 
        }},
      {
        text: '发布过的实验',
        privilege: true,
        linkPath: 'published/published',
        imagePath: {
          logIn: '/images/published1.png', //发布过图标
          logOut:'/images/published0.png', 
          }
        },
        {
          text: '审核被试',
          privilege: true,
          linkPath: '../currentExp/Expshenhe/Expshenhe',
          imagePath: {
            logIn: '/images/check1.png', //发布过图标
            logOut: '/images/check0.png',
          }
        },
        {
          text: '发布实验',
          privilege: true,
          linkPath: 'publish/publish',
          imagePath: {
            logIn: '/images/plus1.png', //发布过图标
            logOut: '/images/plus0.png',
          }
        }
      ],
      [{
        text: '关于',
        privilege: false,
        linkPath: 'about/about',
        imagePath: {
          logIn: '/images/about1.png', //关于图标
          logOut: '/images/about0.png', 
        }},
      {
        text: '设置',
        privilege: false,
        linkPath: 'setting/setting',
        imagePath: {
          logIn: '/images/setting1.png', //设置图标
          logOut: '/images/setting0.png', 
        }}
      ],
    ],
  },
  login: function (info) {
    wx.navigateTo({
      url: 'signIn/signIn',
    });
  }, 
  news: function () {
    wx.navigateTo({
      url: 'news/news',
    })
  },
  me: function(){
      wx.navigateTo({
        url: 'me/me',
      })
  },
  optionTap: function (e) {
    if (!this.data.logIn) {
      wx.showToast({
        title: '请先登录/注册,才能点亮世界',
        icon: 'none',
        duration: 1500,
        mask: true,
      })
    } else {
      if (this.data.privilege &&
       e.currentTarget.dataset.link == 'certificate/certificate'){
        wx.showToast({
          title: '已认证',
          icon:'none',
          duration:1000,
        })
      } else {
        wx.navigateTo({
          url: e.currentTarget.dataset.link,
        })}
    }
  },
  optionLongtap: function (e){
    if (this.data.privilege &&
      e.currentTarget.dataset.link == 'certificate/certificate'){
      wx.navigateTo({
        url: e.currentTarget.dataset.link,
      })
      }

  },
  onLoad: function () {
  },
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'openid',
      success(re) {
        var openid = re.data;
        const db = wx.cloud.database()
        db.collection('UserInfo').doc(openid).get({
          success: function (res) {
            that.setData({
              logIn: true,
              privilege: res.data.privilege,
              avatarUrl: res.data.userAvatarUrl,
              userInfo: res.data,
              userWxInfo: res.data.userWxInfo
            })
            getApp().globalData.logIn = true;
            getApp().globalData.privilege = res.data.privilege;
          }
        })
      }
    })

  },
  onHide: function () {
    getApp().globalData.logIn = this.data.logIn;
    getApp().globalData.privilege = this.data.privilege;
  },
  onShareAppMessage: function () {

  },
  
})