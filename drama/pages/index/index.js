// index.js
Page({
  data:{},
  ticket(){
    wx.navigateTo({
      url: '../ticket/ticket',
      success: (result) => {console.log("change to buy")},
      fail: (res) => {},
      complete: (res) => {},
    });
  },
})
