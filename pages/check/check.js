// pages/check/check.js

var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderSub:"Click to enter",
    servicesArray:[{name:'Poor', checked:false, val:10},{name:'Normal', checked:true, val:15}, {name:'Good', checked: false, val:18}, {name:'Awesome', checked:false, val:20}],
    isRound:false,
    pay:false,
  },
/***************************************************************Action block***********************************************************************/
  /*
   服务评价函数，动态改变Radios
  */
  chooseService: function (res) {
    console.log("选中的标签：" + res.detail.value);
    var arrs = this.data.servicesArray;
    var that = this;
    var tipRate = 0;
    for (const x in arrs) {
      if (arrs[x].name == res.detail.value) {
        arrs[x].checked = true;
        tipRate = arrs[x].val;
        console.log("小费百分比为:" + tipRate);
      } else {
        arrs[x].checked = false;
      }
    }
    that.setData({
      servicesArray: arrs,
      staticTipRate: tipRate,
      TRValue:"",
      isTipRate:false
    });
    this.calWithSubtotal();
  },
  /*
  获取账单金额
  */
  subtotalling:function(res){
    console.log("账单金额获取前sub" + this.data.sub);
    this.validateSub(res.detail.value);
    if(this.data.isSubtotal || res.detail.value.trim().length ==0 ){
      this.setData({
        subtotal: res.detail.value,
      });
      this.calWithSubtotal();
      console.log("账单金额" + this.data.subtotal);
      console.log("账单金额获取后sub" + this.data.isSubtotal);
    }
    else{
      wx.showToast({
        title: 'Invalid Subtotal',
        icon: 'none',
        duration:800,
      })
    }
  },

  /**
   *是否向下凑整
   */
  roundToInt:function(){
    var round = this.data.isRound;
    this.setData({
      isRound:!round,
    })
    if(!round){
      this.setData({
        round:"Yes"
      })
    }
    else{
      this.setData({
        round: "Nope"
      })
    }
    if(this.data.isSubtotal){
      if (this.data.isTipRate){
        console.log("calWithTR");
        this.calWithTipRate();
      }else if(this.data.isTotal){
        this.calWithTotal();
      }else if(this.data.isTip){
        this.calWithTip();
      }else{
        this.calWithSubtotal();
      }
    }
  },

  newTipRate:function(res){
    this.validateTipRate(res.detail.value);
    if (this.data.isTipRate) {
      this.setData({
        staticTipRate: res.detail.value,
      });
      console.log("小费率" + this.data.staticTipRate);
      this.calWithTipRate();
    }
    else {
      wx.showToast({
        title: 'Invalid TipRate',
        icon: 'none',
        duration: 800,
      })
    }
  },

  /*********************************************************************caculate block***************************************************************/
  /*
  计算最终账单
  */
  calWithSubtotal:function(){
    if(this.data.isSubtotal){
      var subtotal = Number(this.data.subtotal);
      var tipRate = Number(this.data.staticTipRate);
      var t = subtotal + subtotal * tipRate / 100;
      var tr = (t-subtotal)/subtotal * 100;
      if (this.data.isRound) {
        this.setData({
          total: parseInt(t),
          tipRate: tr,
          tip: parseInt(t-subtotal),
        })
      }else{
        this.setData({
          total: Math.floor(t * 100) / 100,
          tipRate: Math.floor(tr * 100) / 100,
          tip:Math.floor((t - subtotal) * 100) / 100,
          });
      }
      console.log("总金额:" + this.data.total+" tipRate: "+ this.data.tipRate)
    }
    else{
      this.setData({
        total:"",
        tipRate:"",
        tip:""
      });
    }
  },

  calWithTipRate:function(){
    if(this.data.isTipRate){
      console.log("staticTipRate: " + this.data.staticTipRate);
      var subtotal = Number(this.data.subtotal);
      var tipRate = Number(this.data.staticTipRate);
      console.log("tipRate: " + tipRate);
      var t = subtotal + subtotal * tipRate / 100;
      var ti = (t - subtotal);
      
      if(this.data.isRound){
        this.setData({
          total: parseInt(t),
          TRValue: (parseInt(t)-subtotal) * 100/subtotal,
          tipRate:this.data.staticTipRate,
          tip: parseInt(t - subtotal)
        })
        console.log("取整后小费："+ this.data.TRValue);
      }else{
        this.setData({
          total: Math.floor(t * 100) / 100,
          TRValue:this.data.staticTipRate,
          tip: Math.floor((t - subtotal) * 100) / 100,
        });
      }
    }
    else{
      this.setData({
        total: "",
        tipRate: "",
        tip: ""
      });
    }
  },

  /************************************************************Validate block***********************************************************************/

  validateSub: function (subtotal) {
    if (!isNaN(Number(subtotal)) && Number(subtotal) > 0) {
      this.setData({
        isSubtotal: true
      })
    }
    else {
      this.setData({
        isSubtotal: false
      })
    }
  },

  validateTipRate: function (tipRate){
    if (!isNaN(Number(tipRate)) && Number(tipRate) > 0) {
      this.setData({
        isTipRate: true
      })
    }
    else {
      this.setData({
        isTipRate: false
      })
    }
  },

  /*****************************************************************Life Cycle***********************************************************************/
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = util.formatTime(new Date());
    this.setData({
      time : time,
      staticTipRate: 15
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
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