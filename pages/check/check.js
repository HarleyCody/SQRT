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
    var arrs = this.data.servicesArray;
    var that = this;
    var tipRate = 0;
    for (const x in arrs) {
      if (arrs[x].name == res.detail.value) {
        arrs[x].checked = true;
        tipRate = arrs[x].val;
      } else {
        arrs[x].checked = false;
      }
    }
    that.setData({
      servicesArray: arrs,
      defualtTipRate:tipRate,
      staticTipRate: tipRate,
      TRValue:"",
      isTipRate:false
    });
    this.calWithSubtotal();
  },
  /*
  获取账单金额
  */
  newSubtotal:function(res){
    this.validateSub(res.detail.value);
    if(this.data.isSubtotal || res.detail.value.trim().length ==0 ){
      this.setData({
        subtotal: res.detail.value,
      });
      this.calWithSubtotal();
    }else{
      wx.showToast({
        title: 'Invalid Subtotal',
        icon: 'none',
        duration:800,
      })
    }
  },
  /*获取新 Tip*/
  newTip: function (res) {
    this.validateTip(res.detail.value);
    if (this.data.isRound) {
      wx.showToast({
        title: 'Turn off Reserve to proceed',
        icon: 'none',
        duration: 800,
      });
      return;
    }
    if (this.data.isTip) {
      this.setData({
        staticTip: res.detail.value,
      })
      console.log("小费: " + this.data.staticTipRate);
      this.calWithTip();
    } else {
      wx.showToast({
        title: 'Invalid TipRate',
        icon: 'none',
        duration: 800,
      })
    }
  },

  /*获取新 Total*/
  newTotal: function (res) {
    this.validateTotal(res.detail.value);
    if (this.data.isRound || res.detail.value.trim().length == 0) {
      wx.showToast({
        title: 'Turn off Reserve to proceed',
        icon: 'none',
        duration: 800,
      });
      return;
    }
    if (this.data.isTotal || res.detail.value.trim().length == 0) {
      this.setData({
        staticTotal: Math.floor(res.detail.value * 100) / 100,
      });
      console.log("合计:" + this.data.staticTotal);
      this.calWithTotal();
    } else {
      wx.showToast({
        title: 'Invalid TipRate',
        icon: 'none',
        duration: 800,
      })
    }
  },

  /*获取新 Tip Rate*/
  newTipRate: function (res) {
    this.validateTipRate(res.detail.value);
    if(this.data.isRound){
      wx.showToast({
        title: 'Turn off Reserve to proceed',
        icon: 'none',
        duration: 800,
      });
      return;
    }
    if (this.data.isTipRate || res.detail.value.trim().length == 0) {
      this.setData({
        staticTipRate: Math.floor(res.detail.value * 100)/100,
      });
      console.log("小费率" + this.data.staticTipRate);
      this.calWithTipRate();
    } else {
      wx.showToast({
        title: 'Invalid TipRate',
        icon: 'none',
        duration: 800,
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
    }else{
      this.setData({
        round: "Nope"
      })
    }
    if(this.data.isSubtotal){
      if (this.data.isTipRate){
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

  validateTipRate: function (tipRate) {
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

  validateTip: function (t) {
    if (!isNaN(Number(t)) && Number(t) > 0) {
      this.setData({
        isTip: true
      })
    }
    else {
      this.setData({
        isTip: false
      })
    }
  },

  validateTotal: function (total) {
    if (!isNaN(Number(total)) && Number(total) > 0) {
      this.setData({
        isTotal: true
      })
    }
    else {
      this.setData({
        isTotal: false
      })
    }
  },

  /*********************************************************************caculate block***************************************************************/
  /**
   *计算最终账单
   */
  calWithSubtotal:function(){
    console.log("Running with Subtotal");
    if(this.data.isSubtotal){
      var subtotal = Number(this.data.subtotal);
      var tipRate = Number(this.data.defualtTipRate);
      var t = subtotal + subtotal * tipRate / 100;
      var tr = (t-subtotal)/subtotal * 100;
      if (this.data.isRound) {
        this.setData({
          total: parseInt(t),
          tipRate: parseInt(t-subtotal) * 100 /subtotal,
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

  /* 通过 小费 计算 */
  calWithTip: function () {
    console.log("Running with Tip");
    if (this.data.isTip) {
      this.setData({
        TRValue: "",
        TotValue: ""
      });
      var ti = Number(this.data.staticTip);
      var subtotal = Number(this.data.subtotal);
      var tr = ti / subtotal;
      var to = subtotal + ti;
      if (this.data.isRound) {
        ti = Math.floor((parseInt(to) - subtotal) * 100) / 100;
        this.setData({
          total: parseInt(to),
          TValue: ti,
          tipRate: (ti) * 100 / subtotal
        });
      } else {
        this.setData({
          total: Math.floor(to * 100) / 100,
          tipRate: Math.floor(((to - subtotal) / subtotal) * 10000) / 100,
        });
      }
    }
    else {
      this.calWithSubtotal();
    }
  },

  /*通过 总额 计算*/
  calWithTotal: function () {
    console.log("Running with Total");
    this.setData({
      TValue: "",
      TRValue: ""
    });
    var to = Number(this.data.staticTotal);
    var sub = Number(this.data.subtotal);
    var ti = to - sub;
    var tr = ti*100 / sub;
    if(this.data.isTotal){
      if (this.data.isRound) {
        ti = parseInt(ti);
        this.setData({
          tip: ti,
          TotValue: Math.floor((sub + ti) * 100) / 100,
          tipRate: tr,
        });
      } else {
        this.setData({
          tip:Math.floor(ti*100)/100,
          tipRate: tr,
        })
      }
    }
    else {
      this.calWithSubtotal();
    }
  },

  /* 通过 小费率 计算 */
  calWithTipRate:function(){
    
    console.log("Running with TipRate");
    if(this.data.isTipRate){
      this.setData({
        TValue: "",
        TotValue: ""
      });
      var subtotal = Number(this.data.subtotal);
      var tipRate = Number(this.data.staticTipRate);
      var t = subtotal + subtotal * tipRate / 100;
      var ti = (t - subtotal);
      
      if(this.data.isRound){
        this.setData({
          total: parseInt(t),
          TRValue: 100*ti/subtotal,
          tipRate:this.data.staticTipRate,
          tip: (parseInt(t) - subtotal).toFixed(2),
        })
        console.log("Tip 未保留两位小数"+ this.data.tip);
      }else{
        this.setData({
          total: Math.floor(t * 100) / 100,
          TRValue:this.data.staticTipRate,
          tip: Math.floor((t - subtotal) * 100) / 100,
        });
      }
    }
    else{
      this.calWithSubtotal();
    }
  },

  /*****************************************************************Others      ***************************************************************************/

  /*****************************************************************Life Cycle***********************************************************************/
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = util.formatTime(new Date());
    this.setData({
      time : time,
      defualtTipRate:15,
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