// miniprogram/pages/signIn/signIn.js
const app=getApp();
function ageCount(birth) {
  var birthY = birth.substr(0,4);
  var birthM = toDouble(birth.substr(5,2));
  var date = new Date();
  var year = date.getFullYear();
  var month = toDouble(date.getMonth() + 1);
  var ageM = month - birthM;
  if(ageM<0){
    var ageY = year - birthY - 1;
    ageM += 12;
  }else{
    var ageY = year - birthY;
  }
  return ageY + "-" + ageM
} 
function toDouble(num) {
  if (num < 10) {
    num = '0' + num;
  }
  return num;
}
Page({
  data: {
    userAvatarUrl:'',
    userName:'',
    userBirth:'1998-09',
    gender:'',
    fitHand:'',
    sight:'',
    visual:'',
    fileID:'', 
    genderList: ['女', '男'],
    fitHandList: ['右', '左'],
    sightList: {title:'sight',list:["正常","矫正后正常","近视"]},
    visualList: { title: 'visual', list: ["正常", "散光","色盲/色弱", "其他"]},   
  },
  // 选择头像上传图片
  upLoadPro: function () {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        //返回的tempFilePaths是一个数组，因为有可能选择多张图片，则有多条地址数据信息
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        // 上传图片
        var date = new Date()
        var time = date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString()
        const name = Math.random() * 1000000;
        const cloudPath = name.toString() + time + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            that.setData({
              userAvatarUrl: res.fileID
            })
          },
          fail: e => {
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },

  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },

  birthChange: function (e) {
    this.setData({
      userBirth: e.detail.value,
      changed:true
    })
  },

  showModal: function (e){
    this.setData({
      modalData: e.currentTarget.dataset.modal
    });
    this.modal.showModal();
  },

  genderChange: function (e) {
    this.setData({
      gender: e.target.dataset.item
    });
  },

  fitHandChange: function (e) {
    this.setData({
      fitHand: e.target.dataset.item
    });
  },

  itemSelect: function (e) {
    var type = e.currentTarget.dataset.type;
    var value = e.currentTarget.dataset.value;
    if (type == 'sight') {
      this.setData({
        sight: value
      });
    } else {
      this.setData({
        visual: value
      });}
    this.modal.closeModal();
  },

  login: function (info) {
    var info = info.detail.userInfo;
    var condition=true;
    var date = new Date();
    var data = {
      userName : this.data.userName,
      userBirth : this.data.userBirth,
      userAge: ageCount(this.data.userBirth),
      userGender : this.data.gender,
      userFithand : this.data.fitHand,
      userSight : this.data.sight,
      userVisual : this.data.visual,
      privilege: false,
      publishExp: [],
      participantExp: [],
      currentExp:[],
      news:[],
      code:'INITIALCODE'
    };
    for (let i of Object.values(data)) {
      if (i === "" ) {
        condition = false
      }
    }
    if (condition){
      var reg = new RegExp("[\u4E00-\u9FA5]{2,4}");
      if (!reg.test(data.userName)){
        wx.showToast({
          title: '请使用2-4字中文名',
          icon: 'none',
          duration: 2000,
        });
      } else {
        var that = this;
        // 调用云函数
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            getApp().globalData.openid = res.result.openid,
              wx.setStorage({
                key: "openid",
                data: res.result.openid
              });
            that.setData({
              userAvatarUrl: info.avatarUrl,
              userWxInfo: info
            })
            var openid = res.result.openid;
            wx.showModal({
              title: '确认提交',
              content: '个人信息仅用于相关科学实验发布或预约，确认提交后不可更改，请确保所填信息真实有效。',
              cancelText: '检查一下',
              confirmText: '确认提交',
              success(res) {
                if (res.confirm) {
                  const db = wx.cloud.database();
                  if (that.data.userAvatarUrl == '') {
                    data['userAvatarUrl'] = that.data.avatarUrl;
                  } else {
                    data['userAvatarUrl'] = that.data.userAvatarUrl;
                  }
                  data['userWxInfo'] = that.data.userWxInfo;
                  data['_id'] = openid;
                  db.collection('UserInfo').add({
                    data: data
                  }).then(res => {
                    wx.setStorage({
                      key: "userInfo",
                      data: data,
                    })
                    wx.showToast({
                      title: '注册成功',
                      icon: 'none',
                      duration: 2000,
                    });
                    wx.navigateBack({
                      detal: 1,
                    })
                  })
                }
              }
            })
          },
          fail: err => {
            wx.showToast({
              title: '登录状态异常',
              image: '/images/fail0.png',
              duration: 2000,
            });
          }
        });}
      }else{
        wx.showToast({
          title: '请填写完整信息',
          image: '/images/fail0.png',
          duration:2000,
        })
      }

  },

  onLoad: function (options) {
    this.modal = this.selectComponent("#modal");
  },

  onReady: function () {
    wx.showToast({
      title: '请填写真实的个人信息',
      icon: 'none',
      duration: 2000,
    });
    var date=new Date();
    var month = toDouble(date.getMonth() + 1);
    this.setData({
      today: date.getFullYear() + '-' + month
    })
  },

  onShow: function () {
  },

  onHide: function () {
    this.modal.closeModal();
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