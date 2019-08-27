// components/expSaG.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:{
      type:String,
      value:''
    },
    item: {
      type: Object,
      value: {}
    },

  },
  attached: function () {
    this.init();
  },
  /**
   * 组件的初始数据
   */
  data: {
    largeGroup:false,
    groupLength: 0,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    init: function(){
      var that = this;
      this.setData({
        type: this.data.type,
        item: this.data.item,
      });
      var item = this.data.item;
      if(item.type=='group'){
        if (item.subExpList.length>3){
          this.setData({
            largeGroup: true,
            groupLength: item.subExpList.length,
          })
        }
      }
    },
    chooseSingle: function (){
      var item = JSON.stringify(this.data.item);
      wx.navigateTo({
        url:'/pages/exp/singleExp/singleExp?item='+ item
      })
    },
    chooseGroup: function(){
      var item = JSON.stringify(this.data.item);
      wx.navigateTo({
        url: '/pages/exp/expGroup/expGroup?item=' + item
      })
    },
},
})