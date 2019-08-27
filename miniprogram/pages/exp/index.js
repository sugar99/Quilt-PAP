// miniprogram/pages/exp/index.js

function dateCount(addDays=0) {
  var date = new Date();
  date.setDate(date.getDate() + addDays);//获取AddDayCount天后的日期
  var year = date.getFullYear();
  var month = toDouble(date.getMonth() + 1);;//获取当前月份的日期,js月份从零开始计数
  var mydate = toDouble(date.getDate());
  return year + "-" + month + "-" + mydate;
}

function timeCount(addMinutes = 0, date,time) {
  if (!time) {
    var date = new Date();
    date.setMinutes(date.getMinutes() + addMinutes);
    var hour = toDouble(date.getHours());
    var minute = toDouble(date.getMinutes());
  } else {
    var hour = time[0] + time[1];
    var minute = time[3] + time[4];
    hour = parseInt(hour) + Math.floor(addMinutes / 60);
    minute = parseInt(minute) + addMinutes % 60;
    if (hour>23){
      hour -= 24;
    }
    if (minute > 60) {
      hour = hour + 1;
      minute -= 60;
    }
    hour = toDouble(hour).toString();
    minute = toDouble(minute).toString();
    if(hour=="24"){
      huor = "00"
    }
  }
  return hour + ':' + minute;
}

function toDouble(num) {
  if (num < 10) {
    num = '0' + num;
  }
  return num;
}

Page({
  data: {
    nav: 0,
    WINDOWWIDTH: 0,
    fixed: false,
    menuTop:0,
    imgPath:[
      "../../images/ad1.jpg",
      "../../images/ad2.jpg",
      "../../images/ad3.jpg",
      "../../images/ad4.jpg"
    ],
    classification:[
      { text: "问卷", iconPath: '' },
      { text: "实验", iconPath: '' },
      { text: "脑电", iconPath: '' },
      { text: "其他", iconPath: '' }],
    today: dateCount(0),
    endDate: dateCount(7),
    now: timeCount(0),
    time1: timeCount(0),
    time2: timeCount(120, timeCount(0)),
    time2start: timeCount(30, timeCount(0)),
    explist:[],
    group:[],
    currentTab: 0,
    currentItem: {},
  },
  getHeight(e) {
    this.setData({
      NAVHEIGHT: e.detail.status + e.detail.navHeight,
      WINDOWWIDTH: e.detail.windowWidth,
      nav_ser_height: e.detail.status + e.detail.navHeight + 70 / 750 * e.detail.windowWidth 
    });
  },
  search: function () {
    wx.navigateTo({
      url: 'search/search',
    })
  },
  bindDateChange: function (e) {
    this.setData({
      today: e.detail.value
    })
  },
  bindTimeChange1: function (e) {
    this.setData({
      time1: e.detail.value, 
      time2: timeCount(120, e.detail.value),
      time2start: timeCount(30, timeCount(120, e.detail.value))
    });
  },
  bindTimeChange2: function (e) {
    this.setData({
      time2: e.detail.value,
    });
  },
  showProfessionalClassification:function(){
    wx.navigateTo({
      url: 'professionalClassification/professionalClassification',
    })
  }, 
  classification: function(e) {
    var expMode = e.currentTarget.dataset.value;
    wx.navigateTo({
      url: 'classification/classification?expMode=' + expMode,
    });
  },
  swichNav: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  bindChange: function (e) {
    this.setData({ currentTab: e.detail.current });
  },
  book: function (e) {
    this.setData({
        currentItem: e.target.dataset.value
    });
    this.modal.showModal()  //调用组件中打开模态框方法
  },
  singleExp: function (e) {
    var item = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/exp/singleExp/singleExp?item=' + item
    })
  },
  groupExp: function (e) {
    var item = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '/pages/exp/expGroup/expGroup?item=' + item
    })
  },
  submit: function(){

  },
  selClock: function (e) {
    var dateIndex = e.target.dataset.dateindex;
    var clockIndex = e.target.dataset.clockindex;
    var item = this.data.currentItem;
    var currentClock = item['availableTime'][dateIndex]['clock'][clockIndex];
    if (currentClock[2] < currentClock[1]) {
      for (var i = 0; i < item['availableTime'].length; i++) {
        for (var j = 0; j < item['availableTime'][i]['clock'].length; j++) {
          if (item['availableTime'][i]['clock'][j][3] == 1) {
            item['availableTime'][i]['clock'][j][3] = 0;
            item['availableTime'][i]['clock'][j][2] -= 1;
          }
        }
      }
      item['availableTime'][dateIndex]['clock'][clockIndex][2] += 1;
      item['availableTime'][dateIndex]['clock'][clockIndex][3] = 1;
    };
    this.setData({
      currentItem: item
    });
  },
  onLoad: function () {
    this.modal = this.selectComponent("#modal"); 
    var that = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'downLoadRe',
      // 传给云函数的参数,gather是集合的名称，limitation是搜索条件
      data: {
        gather: 'Experiment',
        limitation: {},
      },
    }).then(res => {
      //得到的res.result.data即以数组形式返回的符合条件的全部记录
      that.setData({
        explist: res.result.data
      })
    })
      .catch(console.error)

  },
  // 当页面滚动距离scrollTop > menuTop菜单栏距离文档顶部的距离时，菜单栏固定定位
  onPageScroll: function (res) {
    if (res.scrollTop >= this.data.menuTop && !this.data.fixed) {
      this.setData({
        fixed: true
      })
    }
    if (res.scrollTop < this.data.menuTop && this.data.fixed) {
        this.setData({
          fixed: false
        })
    }
  },
  onReady: function () {
  },
  onShow: function () {
    var that = this;
    wx.createSelectorQuery().select('#ad').boundingClientRect(function (res) {
      that.setData({
        adTop: res.top + 10 / 750 * that.data.WINDOWWIDTH
      })
    }).exec();
    wx.createSelectorQuery().select('#time').boundingClientRect(function (res) {
      that.setData({
        menuTop: res.top - that.data.adTop
      })
    }).exec();
  },
  onHide: function () {
    this.modal.closeModal()
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