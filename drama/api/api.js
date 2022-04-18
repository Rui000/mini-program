const ApiRootUrl = 'http://39.107.48.32:8080/woniu/'

module.exports={
  getOpenid: ApiRootUrl + 'wxLogin.do',
  getHistory: ApiRootUrl + 'history.do',
  getTicket: ApiRootUrl + 'ticket.do',
  available: ApiRootUrl + 'isAvailable.do',
  getOrder: ApiRootUrl + 'order.do',
  getPay: ApiRootUrl + 'wxPay.do',
  paySuccess: ApiRootUrl + 'PayOrder.do',
  promo:ApiRootUrl + 'getPromo.do',
  update:ApiRootUrl + 'item.do'
}