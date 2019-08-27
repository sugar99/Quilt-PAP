// components/myModal/myModal.js
Component({
  /**
   * 组件的属性列表（共有数据）
   */
  properties: {
    //modal出现动画类型
    fadeStyle: {
      type: String,
      value: '',
      observer(newVal, oldVal, changedPath) {
        // 属性被改变时执行的函数（可选），通常 newVal 就是新设置的数据， oldVal 是旧数        
        if (newVal == "slideUp") {//从下向上滑出
          this.setData({
            bottom: '-' + this.properties.height,
          })
        } else if (newVal == "slideDown") {//从上向下滑出
          this.setData({
            top: '-' + this.properties.height,
          })
        } else if (newVal == "slideRight") {//从左向右滑出
          this.setData({
            left: '-' + this.properties.width
          })
        } else if (newVal == "slideLeft") {//从右向左滑出
          this.setData({
            right: '-' + this.properties.width
          })
        }
      }
    },
    width: {
      type: String,
      value: '100%',
    },
    height: {
      type: String,
      value: '80%',
    },
    top: {
      type: String,
      value: ''
    },
    bottom: {
      type: String,
      value: ''
    },
    left: {
      type: String,
      value: ''
    },
    right: {
      type: String,
      value: ''
    },
    opacity: {
      type: String,
      value: '0'
    },
  },

  /**
   * 组件的初始数据（私有数据）
   */
  data: {
    //控制模态框打开关闭参数
    status: false
  },
  options: {
    addGlobalClass: true, //使其可以使用全局样式
    multipleSlots: true //使其可以使用多个slot，用name区分
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //打开模态框
    showModal: function (e) {
      
      this.setData({
        status: true
      })
      //需要等模态框出现再执行动画，否则无动画效果
      setTimeout(function () {
        if (this.properties.fadeStyle == "slideUp") {
          this.setData({
            bottom: 0,
            opacity: 1
          })
        } else if (this.properties.fadeStyle == "slideDown") {
          this.setData({
            top: 0,
            opacity: 1
          })
        } else if (this.properties.fadeStyle == "slideRight") {
          this.setData({
            left: 0,
            opacity: 1
          })
        } else if (this.properties.fadeStyle == "slideLeft") {
          this.setData({
            right: 0,
            opacity: 1
          })
        }
      }.bind(this), 100)
    },
    //关闭模态框
    closeModal: function () {
      //判断动画样式
      if (this.properties.fadeStyle == "slideUp") {
        this.setData({
          bottom: '-' + this.properties.height,
          opacity: 0
        })
      } else if (this.properties.fadeStyle == "slideDown") {
        this.setData({
          top: '-' + this.properties.height,
          opacity: 0
        })
      } else if (this.properties.fadeStyle == "slideRight") {
        this.setData({
          left: '-' + this.properties.width,
          opacity: 0
        })
      } else if (this.properties.fadeStyle == "slideLeft") {
        this.setData({
          right: '-' + this.properties.width,
          opacity: 0
        })
      }
      //等关闭动画完毕后再移除模态框和遮罩
      setTimeout(function () {
        this.setData({
          status: false
        })
      }.bind(this), 400)
    },
    //监听下滑关闭事件
    // 触摸开始事件
    touchStart: function (e) {
      touchDotX = e.touches[0].pageX; // 获取触摸时的原点
      touchDotY = e.touches[0].pageY;
      // 使用js计时器记录时间    
      interval = setInterval(function () {
        time++;
      }, 100);
    },
    // 触摸结束事件
    touchEnd: function (e) {
      let touchMoveX = e.changedTouches[0].pageX;
      let touchMoveY = e.changedTouches[0].pageY;
      let tmX = touchMoveX - touchDotX;
      let tmY = touchMoveY - touchDotY;
      if (time < 20) {
        let absX = Math.abs(tmX);
        let absY = Math.abs(tmY);
        if (absX > 2 * absY) {
          if (tmX < 0) {
            console.log("左滑=====")
          } else {
            console.log("右滑=====")
          }
        }
        if (absY > absX * 2 && tmY < 0) {
          console.log("上滑动=====")
        }
      }
      clearInterval(interval); // 清除setInterval
      time = 0;
    },
    slipToClose: function(){
      let touchDotX = 0;//X按下时坐标
      let touchDotY = 0;//y按下时坐标
      let interval;//计时器
      let time = 0;//从按下到松开共多少时间*100
      touchStart();
      touchEnd();
    }



  }
})