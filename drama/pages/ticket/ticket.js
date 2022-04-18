// pages/ticket/ticket.js

const app = getApp();
const api = require('../../api/api.js')
import plugin from '../../component/v2/plugins/index'
import selectable from '../../component/v2/plugins/selectable'

plugin
  .use(selectable)

var formatNumber = function (n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const conf = {
  data: {
      calendarConfig:{
        theme:'elegant',
        highlightToday:true,
      },
      showType:1,
      toView: 'green',
      discount:'',
      isTure:false,
      dialog:true,
      principle:"1.\r\n2.\r\n3.\r\n",
      userInfo: '',
      hasUserInfo: false,
      ticketJoin:0,
      ticketAudi:0,
      tea:0,
      ticketList:'',
      ticketNumber:0,
      total:0,
      arr:[
        {num:0,price:0},
      ],
      openid:'',

  },

  jumptoPurchase:function(e){
    console.log('ticketnumber',e.currentTarget.dataset.num)
    console.log('discount',e.currentTarget.dataset.promo)
    console.log('total',e.currentTarget.dataset.total)
    if (e.currentTarget.dataset.num == 0){
      wx.showModal({
        content:'请先选择票',
        cancelColor: 'cancelColor',
      })
    }
    else{
      const num = e.currentTarget.dataset.num
      const Num = JSON.stringify(num)

      console.log('buyopenid',JSON.stringify(e.currentTarget.dataset.openid))
      console.log('num',Num)
      if(this.data.hasUserInfo == false){
        wx.showModal({
          content:'请先登录',
          cancelColor: 'cancelColor',
        })
      }else{
        let date = wx.getStorageSync('dateOrder')
        console.log('cart',this.data.arr)
        wx.navigateTo({
          url: '../purchase/purchase?obj='+JSON.stringify({date:date,openid:e.currentTarget.dataset.openid,num:Num,promo:e.currentTarget.dataset.discount,total_price:e.currentTarget.dataset.total,ticketlist:this.data.arr,session:this.data.showType})
        })
      }
    }
  },
  bindFormSubmit: function(e) {
    console.log("promo",e.detail.value.coupon)
    var promoCode = e.detail.value.coupon
    wx.request({
      url: api.promo,
      method:'POST',
      data:{
        promo:promoCode
      },
      success: (res) => {
        console.log('res.data',res.data)
        //let totalPrice = wx.getStorageSync('totalPrice')
        this.setData({
          discount:promoCode,
          isTure:true,
          promoPrice:res.data.result.deduction,
          total:this.data.totalPrice-res.data.result.deduction > 0 ? totalPrice-res.data.result.deduction : 0
        })
      }
    })
    
  },
  removeSubmit:function(e){
    let totalPrice = wx.getStorageSync('totalPrice')
    console.log('remove',e.detail.value)
    this.setData({
      isTure:false,
      total:totalPrice
    })
  },
  getUserProfile(e) {
    var _this = this
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    if(this.data.hasUserInfo == false){
      wx.getUserProfile({
        desc: '用于完善资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success:(res)=>{
          console.log('success')
          wx.login({
            success (res) {
              console.log('succuesslog',res.code)
              if (res.code) {
                //发起网络请求
                wx.request({
                  url: api.getOpenid,
                  method:"POST",
                  data: {
                    code: res.code
                  },
                  success:(res)=>{
                    console.log('logresponsd',res.data.result.openid)
                    _this.setData({
                      openid:res.data.result.openid
                    })
                  },
                  fail(res){
                    console.log('fail')
                  }
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
          wx.navigateTo({
            url: '../user/user?info='+ JSON.stringify(res.userInfo),
          })
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          })
          let userInfo = res.userInfo
          app.globalData.userInfo = userInfo
          app.globalData.hasUserInfo = this.data.hasUserInfo
          console.log('info',app.globalData.hasUserInfo)
        },
        fail:(res)=>{
          console.log('fail')
          let result = 0
          wx.navigateTo({
            url: '../user/user?info='+ JSON.stringify(result),
          })
        }
      })
      }else{
        wx.navigateTo({
          url: '../user/user',
        })
      }
  },
  switchTab: function(event) {
    this.setData({
      total:0
    })
    console.log(event)
    let showType = event.currentTarget.dataset.index;
    wx.setStorageSync('showType', showType);
    this.setData({
      showType: showType,
    });
    let date = wx.getStorageSync('dateOrder')
    console.log('dateSwitch',date)
    wx.request({
      url: api.getTicket,
      method:'POST',
      data:{
        date:date,
        session:showType
      },
      success:(res)=>{
        console.log('ticketListResult',res.data.ticket)
        this.setData({
            ticketList:res.data.ticket
        })
      },
      fail(res){
        console.log('fail')
      }
    })
  },
  onClose:function(){
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);//获取今年份  
    var Y =date.getFullYear();//获取月份 
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);//获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
    let today = Y+'-'+M+'-'+D
    console.log('today',today)
    wx.setStorageSync('dateOrder', today)
    const calendar = this.selectComponent('#calendar').calendar
    var that = this
    const { year, month } = calendar.getCurrentYM()
    console.log('current month','0' + month.toString())
    wx.request({
      url: api.available,
      method:'POST',
      data:{
        month:'0' + month.toString(),
      },
      success(res){
        console.log('dateList',res.data.availableList)
        that.setData({
          enableDateList:res.data.availableList
        })
        calendar.enableDates(res.data.availableList)
      },
      fail(err){
        console.log('fail')
      }
    })
    wx.request({
      url: api.getTicket,
      method:'POST',
      data:{
        date:today,
        session:this.data.showType
      },
      success:(res)=>{
        console.log('defineTicketListResult',res.data.ticket)
        this.setData({
            ticketList:res.data.ticket
        })
      },
      fail(res){
        console.log('fail')
      }
    })
  },
  whenChangeMonth(){
    const calendar = this.selectComponent('#calendar').calendar
    const { year, month } = calendar.getCurrentYM()
    console.log('current month',month)
    wx.request({
      url: api.available,
      method:'POST',
      data:{
        month:'0' + month.toString(),
      },
      success(res){
        console.log('dateList',res.data.availableList)
        calendar.enableDates(res.data.availableList)
      },
      fail(err){
        console.log('fail')
      }
    })
  },
  afterTapDate(e){
    console.log('aftertapdate',e.detail)
    this.setData({
      total:0
    })
    let date = [e.detail.year,e.detail.month,e.detail.date].map(formatNumber).join('-')
    console.log('formatedate',date)
    wx.setStorageSync('dateOrder', date)   
    wx.request({
      url: api.getTicket,
      method:'POST',
      data:{
        date:date,
        session:this.data.showType
      },
      success:(res)=>{
        console.log('ticketListResultfromtap',res.data.ticket)
        this.setData({
          ticketList:res.data.ticket
        })
      },
      fail(res){
        console.log('fail')
      }
    })
  },
  onLoad: function (options) {

  },
  onChange(event) {
    var _this = this;
    let cart = this.data.arr
    console.log('cart',cart)
    const inx = event.currentTarget.dataset.index
    console.log('index',inx)
    console.log('event',event.detail)
    cart.map((item, index) => { cart[inx] = { "num": event.detail,"price": event.currentTarget.dataset.price,"session":event.currentTarget.dataset.session,"time":event.currentTarget.dataset.time,"type":event.currentTarget.dataset.type} })//数组里添加对象数组
    console.log('cart',cart)
    this.setData({
      arr:cart
    })
    console.log('arr',this.data.arr)
    var total_price = 0 
    for (var i = 0; i < cart.length; i++) {
      var P = _this.data.arr[i].price;
      var N = _this.data.arr[i].num;
      total_price += P * N;
    }
   // wx.setStorageSync('totalPrice', total_price)
    this.setData({
      total:total_price,
      ticketNumber:event.detail

    })
    console.log('ticketnumber',event.detail);
    console.log('index',event.currentTarget.dataset.index)
    console.log('total',total_price)
  },
  onChange1st(event){
    console.log('second',event.detail);
    this.setData({
      ticketAudi:event.detail
    })
  },
  onChange3rd(event){
    console.log('third',event.detail);
    this.setData({
      tea:event.detail
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
}
Page(conf)