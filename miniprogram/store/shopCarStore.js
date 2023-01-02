import {
  HYEventStore
} from 'hy-event-store'
const db = wx.cloud.database()


const shopCarStore = new HYEventStore({
  state: {
    // 购物车列表
    carList: [],
    // 总价
    totalPrice: 0,
  },
  actions: {
    // 添加购物车
    addCarList(ctx, goods) {
      // 默认都为选中
      goods.isSelect = true
      ctx.carList.push(goods)

      
    },
    // 选中商品的总价
    async selectGoodTotal(ctx) {
      const res = await wx.getStorage({
        key: "list"
      })
      ctx.carList = res.data
      const selectArr = ctx.carList.filter(el => el.isSelect)
      console.log(selectArr)
    },

  }
})
export default shopCarStore