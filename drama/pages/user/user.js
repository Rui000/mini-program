// pages/user/user.js
const app = getApp();
const { paySuccess } = require('../../api/api.js');
const api = require('../../api/api.js')
Page({

  /**
   * Page initial data
   */
  data: {
    showType:0,
    userInfo:'',
    hasUserInfo:false
    
  },
  switchTab: function(event) {
    console.log(event)
    let showType = event.currentTarget.dataset.index;
    wx.setStorageSync('showType', showType);
    this.setData({
      showType: showType,
    });
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
   this.setData({
    userInfo: app.globalData.userInfo,
    hasUserInfo:app.globalData.hasUserInfo
   })
  console.log('userinfo',this.data.userInfo)
  wx.request({
    url: api.getHistory,
    method:'POST',
    data:{
      openid:'11'
    },
    success(res){
      console.log('ee')
      console.log('result',res.data)
    }
  })



  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})