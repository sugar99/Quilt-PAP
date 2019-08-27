// miniprogram/pages/me/timeBlockMake/timeBlockMake.js

function dateCount(currentdate,mode='plus',day=1) {
  var date = new Date(currentdate);
  var day = day;
  if(mode=='minus'){
    day = -1;
  }
  date.setDate(date.getDate() + day);//获取AddDayCount天后的日期
  var month = toDouble(date.getMonth() + 1);;//获取当前月份的日期,js月份从零开始计数
  var mydate = toDouble(date.getDate());
  var day = weekCount(date.getDay())
  return [month,mydate,day];
}

function timeCount(addMinutes = 0, date, time) {
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
    if (hour > 23) {
      hour -= 24;
    }
    if (minute > 60) {
      hour = hour + 1;
      minute -= 60;
    }
    hour = toDouble(hour).toString();
    minute = toDouble(minute).toString();
    if (hour == "24") {
      huor = "00"
    }
  }
  return hour + ':' + minute;
}

function toDouble(num) {
  if (num < 10) {
    num = '0' + num;
  }
  return num+'';
}

function weekCount(week){
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
  }else{
    return "日";
  }
}
Page({
  data: {
    title:'时间选择',
    expDuration:'60',
    buttonText:'添加',
    timeBlock:true,
    chooseBlock:false,
    dateList:[],
    startDate:'',
    endDate:'',
    startTime:'08:00',
    endTime:'22:00',
    completed:false,

  },
  getHeight(e) {
    this.setData({
      NAVHEIGHT: e.detail.status + e.detail.navHeight,
      WINDOWWIDTH: e.detail.windowWidth,
    });
  }, 
  help:function(){
    this.modal.showModal();
  },
  dateChange:function(e){
    var year = e.detail.value.substring(0, 4);
    var month = e.detail.value.substring(5, 7);
    var dat = e.detail.value.substr(8,2);
    var date = month + ' ' + dat + ',' + year;
    var day = weekCount(new Date(date).getDay());
    this.setData({
      currentDate : [month,dat,day]
    })
  },
  dateCount: function (e) {
    var mode = e.currentTarget.dataset.mode;
    var date = this.data.currentDate;
    var late = (date.slice(0, 2).join('-') == this.data.endDate.substr(5, 5));
    var early = (date.slice(0, 2).join('-') == this.data.startDate.substr(5, 5));
    var par = new Date().getFullYear();
    var parameter = date.slice(0, 2).join(' ') + ',' + par;
    var currentDate = dateCount(parameter, mode);
    if (early && mode == 'minus' || late && mode == 'plus') {
      wx.showToast({
        title: '只能选择未来7日以内',
        icon: 'none',
      })
    }else{
      this.setData({
        currentDate: currentDate,
      })
    }
  },
  timechange: function (e) {
    var id = e.target.dataset.id;
    var value = e.detail.value; 
    var date = this.data.currentDate.slice(0,2).join('-');
    var time2 = this.data.currentTime2;
    if (parseInt(value.substr(0, 2)) >= parseInt(time2.substr(0,2))){
      var time2 = timeCount(this.data.expDuration, date, value)
    }
    if (id == '1') {
      this.setData({
        currentTime1: value,
        currentTime2: time2
      })
    } else {
      var time1 = this.data.currentTime1;
      if (parseInt(value.substr(0, 2)) < parseInt(timeCount(this.data.expDuration, date, time1).substr(0, 2))) {
        value = timeCount(this.data.expDuration, date, time1)
        console.log(time1)
      }
      this.setData({
        currentTime2: value
      })
    }
  },
  timeBlockSure: function () {
    var date = this.data.currentDate;
    var time = this.data.currentTime1 + '-' + this.data.currentTime2;
    var dateList = this.data.dateList;
    var condition = false;//是否已经存在相同日期块
    for (let it of Object.values(dateList)) {
      if(it.date.join() == date.join()){
        let con = false;//是否已经存在相同时间块
        for (let ti = 0; ti < it.clockList.length; ti++) {
          if (it.clockList[ti] === time) {
            wx.showToast({
              title: '该时间块已存在',
              icon:'none'
            })
            con = true;
            break;
          }
        }
        if(!con){
          it.clockList.push(time);
        }
        condition = true;
        break;
      }
    }
    if(!condition){
      dateList.push({
        date: date,
        clockList: [time]
      }) 
    }
    this.setData({
      dateList: dateList
    })

  },
  subDateChange: function (e) {
    var item = e.currentTarget.dataset.item;
    var year = e.detail.value.substring(0, 4);
    var month = e.detail.value.substring(5, 7);
    var dat = e.detail.value.substr(8, 2);
    var date = month + ' ' + dat + ',' + year;
    var day = weekCount(new Date(date).getDay());
    var dateList = this.data.dateList;
    for (let it of Object.values(dateList)) {
      if (it.date.join() == item.date.join()) {
        it.date = [month,dat,day];
        break;
      }
    }
    this.setData({
      dateList: dateList
    })
  },
  subDateLongpress:function(e){
    var item = e.currentTarget.dataset.item;
    var date = item.date;
    this.setData({
      currentDate: date
    })
  },
  dateBlockClick: function (e) {
    var mode = e.currentTarget.dataset.mode;
    var item = e.currentTarget.dataset.item;
    var dateList = this.data.dateList;
    if(mode=='plus'){
      dateList.push(item);
    }else{
      for (let it=0;it<dateList.length;it++) {
        if (dateList[it].date.join() == item.date.join()) {
          dateList.splice(it, 1);
          break;
        }}
    }
    this.setData({
      dateList: dateList
    })


  },
  clockBlockLongpress: function (e) {
    var item = e.currentTarget.dataset.item;
    var dateList = this.data.dateList;
    var time = e.currentTarget.dataset.time;
    for (let it = 0; it < dateList.length; it++) {
      if (dateList[it].date.join() == item.date.join()) {
        for (let ti = 0; ti < dateList[it].clockList.length;ti++){
          if (dateList[it].clockList[ti]==time){
            dateList[it].clockList.splice(ti,1)
            if (dateList[it].clockList.length==0){
              dateList.splice(it, 1)
            }
            break;
          }
        }
        break;
      }
    }
    this.setData({
      dateList: dateList
    })

  },
  clockBlockTap:function(e){
    var item = e.currentTarget.dataset.item;
    var dateList = this.data.dateList;
    var time = e.currentTarget.dataset.time;
    for (let it = 0; it < dateList.length; it++) {
      if (dateList[it].date.join() == item.date.join()) {
        for (let ti = 0; ti < dateList[it].clockList.length; ti++) {
          if (dateList[it].clockList[ti] == time) {
            this.setData({
              currentTime1:time.substr(0,5),
              currentTime2: time.substr(6,5)
            })
          }
        }
        break;
      }
    }
    this.setData({
      dateList: dateList
    })
  },
  submit:function(){
    var dateList = this.data.dateList;
    var condition = true;
    if (dateList.length>7){
      wx.showToast({
        title: '仅能选择未来七日内时间块，请检查',
        icon:'none'
      })
      condition = false;
    }else if(dateList.length==0){
      wx.showModal({
        title: '没有提交内容哦！',
        content: '是否需要使用帮助？',
        cancelText:'退出编辑',
        confirmText:'显示帮助',
        success:function(res){
          if(res.confirm){
            this.modal.showModal();
            condition = false;
          }else if(res.cancel){
            wx.navigateBack({
              detal:1
            })
          }
        }
      })
    } 
    for (let it = 0; it < dateList.length; it++) {
      var item = dateList[it];
      for (let it2 = it+1; it2 < dateList.length; it2++){
        if (dateList[it2].date.join() == item.date.join()) {
          wx.showToast({
            title: '存在相同日期块，请检查！',
            icon:'none'
          })
          condition = false;
          break;
        }
      }
      
    }
    if (condition) {
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        currentInputContent: dateList,
        currentInputTitle: 'availableTime'
      })
      wx.showToast({
        title: '时间编辑成功',
        icon: 'none',
        duration: 1500,
      })
      setTimeout(() => {
        wx.navigateBack({
          detal: 1,
        });
      }, 1500
      );

    }
  },
  onLoad: function (options) {
    var date = new Date();
    var year = date.getFullYear();
    var month = toDouble(date.getMonth() + 1);
    var dat = toDouble(date.getDate());
    var day = weekCount(date.getDay());
    var startDate = year + '-' + dateCount(month + ' ' + dat + ',' + year, 'plus', 0).slice(0, 2).join('-');
    var time1 = toDouble(date.getHours() + ':' + date.getMinutes());
    if (parseInt(time1.substr(0, 2)) > 22) {
      startDate = year + '-' + dateCount(month + ' ' + dat + ',' + year, 'plus', 1).slice(0, 2).join('-');
    }
    if (parseInt(time1.substr(0, 2)) < 8 || parseInt(time1.substr(0, 2)) > 22) {
          time1 = '08:00';    
        };
    var time2 = toDouble(timeCount(parseInt(this.data.expDuration), date, time1));
    var endDate = year + '-' + dateCount(month + ' ' + dat + ',' + year, 'plus', 7).slice(0, 2).join('-');
    this.setData({
      currentDate: [startDate.substr(5, 2), startDate.substr(8, 2), weekCount(date.getDay()+1)],
      currentTime1: time1,
      currentTime2:time2,
      startDate: startDate,
      endDate: endDate,
    })
    this.setData({
      style:options.style
    })
  },
  onReady: function () {
    this.modal = this.selectComponent("#modal");
  },
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