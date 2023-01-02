const db = wx.cloud.database()
const carCol = db.collection('carList')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 购物车列表
    list: [],
    // 复选框
    checked: true,
    // 选中商品的价钱
    totalPrice: 0
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getCarList()
  },

  // 获取购物车商品
  async getCarList() {
    const res = await carCol.get()
    // 查询是否都全选
    let checked = res.data.every(el => el.isSelect)
    this.setData({
      list: res.data,
      checked
    })
    this.selectGoodTotalPrice()
  },
  // 获取选中的购物车价钱
  selectGoodTotalPrice() {
    const {
      list
    } = this.data
    const selectArr = list.filter(el => el.isSelect)
    const totalPrice = selectArr.reduce((prev, curr) => {
      return prev + curr.nowPrice * curr.counts * 100
    }, 0)
    this.setData({
      totalPrice
    })
  },
  // 当输入框值改变
  onChange(e) {
    const value = e.detail
    console.log(value)
  },
  // 全选和非全选
  async onIsCheckedAll(e) {
    const {
      checked
    } = this.data
    const res = await carCol.get()
    res.data.forEach(el => {
      el.isSelect = !checked
    })
    this.setData({
      checked: !checked,
      list: res.data
    })
    this.selectGoodTotalPrice()
    this.updateSelectStatus()
    const goodsCpns = this.selectAllComponents('#goodsCpn')
    // 调用子组件的方法，刷新checked状态
    goodsCpns.forEach(el => {
      el.updateCheckedStatus()
    })
  },
  // 修改数据库中的状态
  async updateSelectStatus() {
    // list更新数据库中的数据
    const {
      list
    } = this.data
    let task = []
    list.forEach(el => {
      const promise = carCol.doc(el._id).update({
        data: {
          isSelect: el.isSelect
        }
      })
      task.push(promise)
    })
    const res = await Promise.all(task)
  }
})