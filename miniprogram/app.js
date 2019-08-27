//app.js
App({
  globalData: {},
  onLaunch: function () {
    wx.cloud.init({
      env: 'pap-cloud',
      traceUser: true,
    });
    var that = this;
    wx.getStorage({
      key: 'openid',
      success(res) {
        var openid = res.data;
        const db = wx.cloud.database()
        db.collection('UserInfo').doc(openid).get().then(res => {
          var privilege = res.data.privilege;
          that.globalData.privilege = privilege;
          that.globalData.logIn = true;
        })
      },
      fail(res){
        wx.showModal({
          title: '登录提醒',
          content: '您尚未登录，是否前往登录？',
          confirmText:"立刻前往",
          cancelText:'我先逛逛',
          success:function(res){
            if(res.confirm){
              wx.switchTab({
                url: "../../pages/me/index",
              })
            }else{
              wx.showToast({
                title: '稍后可在我的主页登录哦~',
                icon:'none'
              })
            }
          }
        })
      }
    })    
  },
  onShow(options) {
    // Do something when show.
  },
  onHide() {
    // Do something when hide.
  },
  onError(msg) {
    console.log(msg)
  },
})
