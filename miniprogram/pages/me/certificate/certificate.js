// miniprogram/pages/denglu/denglu.js
const app = getApp();

Page({
  data: {
    completed: false,
    experimenterList:[],//这是下载下来的所有合法注册单位
    selectList:[],//这是当前选择的单位集合
    index: [0, 0, 0],
    schoolID: '',
    phone: '',
    e_mail: '',
    code: '',
    name: '',
    tap:false
  },

  selectChange: function (e) {
    var index = e.detail.value;
    this.setData({
      index: index,
      tap:true
    })
  },

  selectColumnChange: function (e) {
    var column = e.detail.column;
    var value = e.detail.value;
    //console.log('转动：',column,'值:',value)
    
    var index = this.data.index;
    var selectList = this.data.selectList;
    var list = this.data.experimenterList;
    var unitList = selectList[0];
    var currentDepList = [];
    var currentLabList = [];
    switch (column) {
      case 0:
        index[0] = value;
        var dep = list[index[0]].department
        if (dep !== '') {
          for (let i = 0; i < dep.length; i++) {
            currentDepList.push(dep[i].departmentName)
          }}else{
            currentDepList = ['无'];
        }
        var lab = list[index[0]].department[0].laboratory
        if (lab !== '') {
          for (let i = 0; i < lab.length; i++) {
            currentLabList.push(lab[i].laboratoryName)
          }}else{
          currentLabList = ['无'];
          }
      break;

      case 1:
        index[1] = value;
        currentDepList = selectList[1];
        var lab = list[index[0]].department[index[1]].laboratory
        if (lab !== '') {
        for (let i = 0; i < lab.length; i++) {
          currentLabList.push(lab[i].laboratoryName)
        }}else{
          currentLabList = ['无'];
          }
      break;

      case 2:
        index[2] = value;
        currentDepList = selectList[1];
        currentLabList = selectList[2];
    }

    this.setData({
      index:index,
      selectList: [unitList, currentDepList, currentLabList]
    })

  },

  inputChange: function (e) {
    var id = e.currentTarget.id;
    var value = e.detail.value;
    switch (id) {
      case 'name':
        this.setData({
          name: value
        });
        break;
      case 'schoolID':
        this.setData({
          schoolID: value
        })
        break;
      case 'phone':
        this.setData({
          phone: value
        })
        break;
      case 'e-mail':
        this.setData({
          e_mail: value
        })
        break;
      case 'code':
        this.setData({
          code: value
        })
        break;
    }
    if (this.data.schoolID !=='' &&
      this.data.phone !== '' && 
      this.data.e_mail !== '' && 
      this.data.code !== '' && 
      this.data.name !== ''){
      var statu = true;
    }else{
      var statu = false;
    }
    this.setData({
      completed: statu
    })
  },

  submit: function (e) {
    var index = this.data.index;
    var selectList = this.data.selectList;
    var unit = selectList[0][index[0]];
    var department = selectList[1][index[1]];
    var laboratory = selectList[2][index[2]];
    var schoolID = this.data.schoolID;
    var phone = this.data.phone;
    var e_mail = this.data.e_mail;
    var code = this.data.code;
    var name = this.data.name;

    var openid = getApp().globalData.openid;
    const db = wx.cloud.database()

    db.collection('ExpInfo_by_Console').get({
      success: function (res) {
        var infos = res.data;
        var consoleInfo = {};
        for (let i = 0; i < infos.length; i++) {
          var item = infos[i];
          if (item.code == code && item.unit == unit && item.department == department && item.laboratory == laboratory && item.name == name && item.schoolID == schoolID) {
            consoleInfo = item;
          }
        }
        db.collection('ExpInfo_by_User').get({ 
          success: function (ures) {
            var infos = ures.data;
            var userInfo = {};
            for (let i = 0; i < infos.length; i++) {
              var item = infos[i];
              if (item.code == code && item.unit == unit && item.department == department && item.laboratory == laboratory && item.name == name && item.schoolID == schoolID) {
                userInfo = item;
              }
            }
            var consoleInfoKeys = Object.keys(consoleInfo);
            var userInfoKeys = Object.keys(userInfo);
            if (consoleInfoKeys.length == 0) {//验证失败
              wx.showToast({
                title: '暂无主试权限,如需合作请联系开发者',
                icon: 'none',
                duration: 5000
              })
            } else if (consoleInfo.code == userInfo.code || userInfo.code==code){
              //激活码已使用
              //console.log('激活码已使用')
              wx.showToast({
                title: '请勿使用他人激活码,合作请联系官方。',
                icon: 'none',
                duration: 5000
              })
            }else { 
              //验证成功   
              //console.log('验证成功')
              //修改主试权限
              db.collection('UserInfo').doc(openid)
                .update({
                  data: {
                    privilege: true,
                    code: code
                  },
                });
              var date = new Date();
              var data = {
                time: date,
                phone: phone,
                e_mail: e_mail,
              };
              Object.assign(data, consoleInfo)
              db.collection('ExpInfo_by_User').add({
                data: data,
                success:function(res){
                  //console.log('调用成功')
                },
                faile:function(res){
                  console.log('调用失败')
                }
              })
              wx.showToast({
                title: '验证成功',
                duration: 3000,
              })
              wx.navigateBack({
                delta: 1
              })
            }
          } });   
      },
      fail: function () {
        wx.showToast({
          title: '系统开小差了，稍后再试吧',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },

  help: function () {
    wx.navigateTo({
      url: 'help/help',
    })
  },

  onLoad: function (options) {
    const db = wx.cloud.database()
    db.collection('Experimenter').get().then(res => {
      var list = res.data;
      var unitList = [];
      var currentDepList = [];
      var currentLabList = [];
      for (let i = 0; i < list.length; i++) {
        unitList.push(list[i].unitName)
      }
      var dep = list[0].department
      for (let i = 0; i < dep.length; i++) {
        currentDepList.push(dep[i].departmentName)
      }
      var lab = list[0].department[0].laboratory
      for (let i = 0; i < lab.length; i++) {
        currentLabList.push(lab[i].laboratoryName)
      }
      this.setData({
        experimenterList: res.data,
        selectList: [unitList, currentDepList, currentLabList]
      })
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

  },
  
})