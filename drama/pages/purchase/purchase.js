// pages/purchase/purchase.js
const app = getApp()
const api = require('../../api/api.js')

Page({
  /**
   * Page initial data
   */
  data: {
      items:[
        {select:'boy',gender:'男'},
        {select:'girl',gender:'女',checked:'true'},
      ],
      date:'',
      show:false,
      text:'请选择日期',
      iconName:'calendar-o',
      userName:'',
      userId:'',
      userPhone:'',
      gender:'boy'
  },
  userNameInput:function(e){
    console.log('userName',e.detail.value)
    this.setData({
      userName:e.detail.value
    })
  },
  userIdInput:function(e){
    console.log('userId',e.detail.value)
    this.setData({
      userId:e.detail.value
    })
  },
  userPhoneInput:function(e){
    console.log('userPhone',e.detail.value)
    this.setData({
      userPhone:e.detail.value
    })
  },
  onDisplay() {
    this.setData({ 
      show: true,
      text:'',
      iconName:''
    });
  },
  onClose() {
    this.setData({ show: false });
  },
  formatDate(date) {
    date = new Date(date);
    let birthday = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    return birthday;
  },
  onConfirm(event) {
    console.log('date:',this.formatDate(event.detail));
    this.setData({
      show: false,
      date: this.formatDate(event.detail),
    });
  },
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    const items = this.data.items
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }
    this.setData({
      items,
      gender:e.detail.value
    })
  },
  bindFormSubmit:function(e){
    if(this.data.userId.length==0 || this.data.userName.length==0 || this.data.userPhone.length==0 || this.data.date.length==0){
      wx.showModal({
        title: '提示',
        content: '请完整填写个人信息',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    else{
      /*console.log('openid',this.data.obj.openid)
      console.log('num',this.data.obj.num)
      console.log('total',this.data.obj.total_price)
      console.log('name',this.data.userName)
      console.log('id',this.data.userId)
      console.log('contact',this.data.userPhone)
      console.log('data',this.data)

      
      */
      wx.request({
        url: api.getOrder,
        method:"POST",
        data:{
          openid:this.data.obj.openid,
          count:this.data.obj.num,
          promo:'',
          total_price:this.data.obj.total_price,
          name:this.data.userName,
          ID:this.data.userId,
          contact:this.data.userPhone
        },
        success:(res)=>{
          console.log('successOrder')
          console.log(res.data.result)
          let len = this.data.obj.ticketlist
          for(let i=0;i<len.length;i++){
            console.log('len',len[0])
            console.log('len1',len[i].session)
            wx.request({
              url: api.update,
              method: "POST",
              data:{
                order_number:res.data.result,
                session:len[i].session,
                count:len[i].num,
                type:len[i].type,
                price:len[i].price,
                time:len[i].time,
                name:this.data.userName,
                ID:this.data.userId,
                contact:this.data.userPhone,
                gender:this.data.gender,
                bDay:this.data.date,
              },
              success(res){
                console.log('successitem')
                console.log('res',res.data)
              },
              fail(res){
                console.log('fail')
              }
            })

          }
          
          //pay
         /* wx.request({
            url: api.getPay,
            method:"POST",
            data:{
              order_id:'22',
              openid:'dd',
              spbill_create_ip:'39.107.48.32'
            },
            success(res){
              console.log('successpay')
            }
          })
         wx.request({
          url: api.paySuccess,
          method:"POST",
          data:{
            order_id:15,
            promotion_id:15
          },
          success(res){
            console.log('successpay')
          }
        })
        */
        },
        fail(res){
          console.log('fail')
        }
      })
    }
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log('obj',JSON.parse(options.obj))
    this.setData({
      obj:JSON.parse(options.obj)
    })
    console.log('openid',this.data.obj.openid)
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