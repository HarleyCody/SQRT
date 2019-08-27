// pages/bills/bills.js
import {Record} from '../../utils/record.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logs:[]
  },

clearRecords:function(){
  wx.clearStorageSync('records');
  wx.showLoading({
    title: 'clearing',
    duration: 500
  })
  this.onShow();
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      records:(wx.getStorageSync('records') || []).map(record=>{
        return record.time + "\nsubtotal:"+ record.sub + "\t tip:" + record.ti + "\t total:" + record.total + "\n tip rate:"+ record.tr;
      }),
    }) 
    console.log("got storage " + this.data.records);
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
    this.setData({
      records: (wx.getStorageSync('records') || [])
        .map(record => {
          return record.time + "\n subtotal: \t" + record.sub + "\t tip: \t" + record.ti + "\t total: \t" + record.total + "\n tip rate: \t" + record.tr;
        })
    })
    console.log("got storage " + this.data.records);
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