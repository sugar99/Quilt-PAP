// miniprogram/pages/Publish_Experiment/Publish.js
function weekCount(week) {
  if (week == 1) {
    return "一";
  }
  else if (week == 2) {
    return "二";
  }
  else if (week == 3) {
    return "三";
  }
  else if (week == 4) {
    return "四";
  }
  else if (week == 5) {
    return "五";
  }
  else if (week == 6) {
    return "六";
  } else {
    return "日";
  }
}
Page({
  data: {
    completed: true,
    height:700,
    picturePath:'/images/PAP1.png',
    goPath: '/images/go0.png',
    currentInputTitle:'',
    currentInputContent:'',
    obj: {},
    availableTimeList:[],
    classobj: { 
      title:'epxClass',
      value: ['人格', '面孔', '消费决策', '阅读/学习/记忆', '视知觉/眼动', '空间信息', '发展','其他']
      },
    modeobj:{
      title:'expMode',
      value:['问卷','脑电','实验','其他']
      },
    expBreakobj: {
      title:'expBreak',
      value:[ '<=10', '20', '30','>30','不限']
      },
    genderobj: {
      title:'pantGender',
      value:['不限','仅男生','仅女生']
      },
    sightobj: {
      title:'pantSight',
      value:['视力正常或矫正正常','需要配戴眼镜','不限']
      },
    relationshipobj:{
      title:'pantRelationship',
      value:['不限','恋爱中','单身']
      },
    mLangobj :{
      title:'language',
     value:['中文母语','外文母语','不限']
      },
    inputList:[
      {'title':'实验',
      'items':[
        ['expName','名称', '未编辑','20'],
        ['epxClass','类别', '未选择', '0'],
        ['expMode','方式', '未选择', '0'],
        ['expIntro','简介', '未编辑', '40'],
        ['expLocation','地点', '未编辑', '20'],
        ['expDuration','时长(min)', '未编辑', '3'],
        ['pantReward','报酬(元)', '未编辑','3']]
      },
      {'title': '主试',
        'items': [
          ['panttotalNum','需要的被试总数(人)', '1', '3'],
          ['pantMaxNum','同时容纳被试数(人)', '1','2'],
          ['availableTime','主试可预约时间段', '可定制', '2'],
          ['expBreak','需要与上一实验间隔(min)', '不限', '0']]
      },
      {'title': '被试要求',
        'items': [
          ['pantAge','年龄', '无要求', '10'],
          ['pantGender','性别', '不限', '0'],
          ['pantSight','视力', '正常', '0'],
          ['pantMlang','母语', '中文', '0'],
          ['pantRelationship','情感状况', '不限', '0'],
          ['pantOther','其他', '无', '30'],]
      }
    ],
    expInfo : {
      expName:'大学生心理求助态度问卷',
      epxClass: '消费决策',
      expMode: '问卷',
      expIntro: '答案没有对错，目的在于了解大学生遇到心理困难时候的应对方式',
      expLocation: '中山大学心理学系系楼C305',
      expDuration: '40',
      pantReward: '30',
      panttotalNum: 25,
      pantMaxNum: 1,
      availableTime: '',
      expBreak: '不限',
      pantAge: '在校大学生',
      pantGender: '不限',
      pantSight: '视力正常或矫正正常',
      pantMlang:'中文母语',
      pantRelationship: '不限',
      pantOther: '无',
      }

  },

  edit:function(e){
    var item = e.currentTarget.dataset.item;
    var value = e.currentTarget.dataset.value;
    var parameter={
      index: item[0],
      title: item[1],
      value : value,
      lengthlimit : item[3]
    };
    parameter = JSON.stringify(parameter);
    switch(item[0]){
      case 'epxClass':
        this.setData({
          obj: this.data.classobj
        })
        this.modal.showModal();
        break;

      case 'expMode':
        this.setData({
          obj: this.data.modeobj,
        })
        this.modal.showModal();
        break;
        
      case 'availableTime':
      var style = 'expTimeBlock';
        wx.navigateTo({
          url: '../timeBlockMake/timeBlockMake?style=' + style,
        });
        break;

      case 'expBreak':
        this.setData({
          obj: this.data.expBreakobj,
        })
        this.modal.showModal();
        break;

      case 'pantGender':
        this.setData({
          obj: this.data.genderobj,
        })
        this.modal.showModal();
        break;

      case 'pantSight':
        this.setData({
          obj: this.data.sightobj,
        })
        this.modal.showModal();
        break;

      case 'pantMlang':
        this.setData({
          obj: this.data.mLangobj,
        })
        this.modal.showModal();
        break;

      case 'pantRelationship':
        this.setData({
          obj: this.data.relationshipobj,
        })
        this.modal.showModal();
        break;

      default:
      wx.navigateTo({
        url: '../edit/edit?parameter=' + parameter,
      });
    }
  
  }, 
  select:function(e){
      var title = e.target.dataset.title;
      var value = e.target.dataset.value;
      var info = this.data.expInfo;
      info[title] = value;
      this.setData({
        expInfo : info,
      })
      this.modal.closeModal();
  },
  submit: function (e) {
    var that = this;
    var condition = true;
    wx.getStorage({
      key: 'openid',
      success(res) {
        var openid = res.data;
        var date = new Date();
        var time = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + '_'
          + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
        const db = wx.cloud.database();
        var filePath = that.data.picturePath;
        var info = that.data.expInfo;
        var requirement = [];
        info['expIntro'] = that.data.expIntro;
        info['availableTime'] = that.data.availableTime;
        //检查空项
        for (let item of Object.values(info)) {
          if (item == '') {
            condition = false;
            console.log(item)
            wx.showToast({
              title: '未填写完整，无法发布。请检查',
              icon: "none"
            })
          }
        }
        //其他信息
        var other = {
          _id: openid + '-' + time,
          state: "审核中",
          publishTime: time,
          score: 5,
          comments: [],
          stillNeedPantNum: info.panttotalNum,
          distance: '暂无数据',
          footTime: '暂无数据',
          requirement: requirement,
          type: 'single',
          picturePath: filePath,
        };
        Object.assign(info, other);
        //合成要求
        var re = {};
        re.pantAge = info.pantAge
        re.pantGender = info.pantGender
        re.pantSight = info.pantSight
        re.pantMlang = info.pantMlang
        re.pantRelationship = info.pantRelationship
        re.pantOther = info.pantOther.split(',')
        for (let item of Object.values(re)) {
          if (item !== '不限' && item !== "无") {
            if (typeof item === 'object') {
              for (let i = 0; i < item.length; i++) {
                requirement.push(item[i])
              }
            } else {
              requirement.push(item);
            }
          }
        }
        //上传实验
        if (info.panttotalNum == 0) {
          condition = false;
          wx.showToast({
            title: '当前所填被试数不合理，无法发布实验。',
            icon: "none"
          })
        }
        if (condition) {
          db.collection('Experiment').add({
            data: info
          }).then(res => {
            const name = Math.random() * 1000000;
            const cloudPath = name.toString() + time + filePath.match(/\.[^.]+?$/)[0];
            wx.cloud.uploadFile({
              cloudPath,
              filePath,
              success: res => {
                //console.log('[上传文件] 成功：', res)
                that.setData({ picturePath: res.fileID })
                wx.showLoading({
                  title: '上传中',
                })
                wx.showToast({
                  title: '实验发布成功',
                  duration: 2000
                })
                setTimeout(() => {
                  wx.navigateBack({
                    detal: 1
                  })
                }, 2000)
              },
              fail: e => {
                //console.error('[上传文件] 失败：', e)
                wx.showToast({
                  icon: 'none',
                  title: '图片上传失败',
                })
              }
            })
            wx.hideLoading()
          })
        }
        db.collection('UserInfo').doc(openid).get({
          success: function (res) {
            var expList = res.data.expList;
            expList = expList.push(info._id)
            console.log('explist',expList, info._id)
            db.collection('UserInfo').doc(openid)
              .update({
                data: {
                  expList: expList
                },
                success: function (res) {
                  console.log(res.data, expList)
                }
              })
          }
        })



        }
      })
    


 
    },
  onLoad: function (options) {

  },
  onReady: function () {
    this.modal = this.selectComponent("#modal");
  },

  uploadPic: function () {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        //返回的tempFilePaths是一个数组，因为有可能选择多张图片，则有多条地址数据信息
        const filePath = res.tempFilePaths[0];
        that.setData({ 
          picturePath: filePath 
        });
      },
      fail: e => {
        wx.showToast({
          title: '图片选择失败',
          icon:'/images/fail0.png'
        })
        console.error(e)
      }
    })
  },

  onShow: function () {
    if (this.data.currentInputTitle!==''){
      var info = this.data.expInfo;
      info[this.data.currentInputTitle] = this.data.currentInputContent;
      if (this.data.currentInputTitle == 'availableTime'){
        info[this.data.currentInputTitle] = '已定制';
        this.setData({
          availableTime: this.data.currentInputContent
        })
      } else if (this.data.currentInputTitle == 'expIntro'){
        info[this.data.currentInputTitle] = '已编辑';
        this.setData({
          expIntro: this.data.currentInputContent
        })
      }
      this.setData({
        expInfo: info
      })
    }
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

        