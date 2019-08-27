// pages/navBar/navBar.js
const app = getApp()

Component({
  properties: {
    background: {
      type: String,
      value: '#1E90FF'
    },
    text: {
      type: String,
      value: 'You忘记写标题辣'
    },
    icon: {
      type: String,
      value: ''
    },
    back: {
      type: Boolean,
      value: false
    },
    home: {
      type: Boolean,
      value: false
    },
    fontWeight:{
      type: String,
      value: "normal"
    },
    fontSize: {
      type: Number,
      value: 16
    },
    color: {
      type: String,
      value: '#000000'
    },
  },
  attached: function () {
    var that = this;
    that.setNavSize();
    that.setStyle();
    that.getHeight();
  },
  data: {
  },
  methods: {
    // 通过获取系统信息计算导航栏高度        
    setNavSize: function () {
      var that = this
        , sysinfo = wx.getSystemInfoSync()
        , statusHeight = sysinfo.statusBarHeight
        , windowWidth = wx.getSystemInfoSync().windowWidth
        , isiOS = sysinfo.system.indexOf('iOS') > -1
        //原生胶囊宽87pt，距离右侧7pt，共94pt=125px，back&home区域是65px，加上间隔10px，共计消耗200px，胶囊左边与标题框空10px
        //1pt=4/3 px
        //这里算出来和实际效果不太一样，减掉185px刚刚好，选择相信眼睛哈哈哈
        , titleWidth = windowWidth - 185
        , navHeight;
      if (!isiOS) {
        navHeight = 48;
      } else {
        navHeight = 44;
      }
      that.setData({
        status: statusHeight,
        navHeight: navHeight,
        windowWidth: windowWidth,
        titleWidth: titleWidth,
      })
    },
    setStyle: function () {
      var that = this
        , containerStyle
        , textStyle;
      containerStyle = [
        'background:' + that.data.background
      ].join(';');
      textStyle = [
        "font-weight" + that.data.fontWeight,
        'color:' + that.data.color,
        'font-size:' + that.data.fontSize + 'px'
      ].join(';');
      that.setData({
        containerStyle: containerStyle,
        textStyle: textStyle
      })
    },
    //将状态栏以及导航栏高度传出组件备用
    getHeight() {
      var myData={
        status: this.data.status,
        navHeight: this.data.navHeight,
        windowWidth: this.data.windowWidth,    
      }
      this.triggerEvent('getHeight', myData)
      },
    // 返回事件   
    back: function () {
      wx.navigateBack({
        delta: 1
      })
    },
    home: function () {
      let pages = getCurrentPages()
      wx.navigateBack({
        delta: pages.length
      })
    }
  }
})
