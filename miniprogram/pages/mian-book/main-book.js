// 连接云数据库
const db = wx.cloud.database()
const bannerCol = db.collection('banner')
const bookCol = db.collection('book')
const carCol = db.collection('carList')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    discountList: [],
    recommendList: [],
    currentPage: 1,
    pageSize: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getBanner()
    this.getDiscountBook()
    this.getRecommend()
  },
  // 获取banner数据
  async getBanner() {
    const res = await bannerCol.get()
    this.setData({
      banner: res.data
    })
  },
  // 获取特价书籍
  async getDiscountBook() {
    const res = await bookCol.skip(0).limit(10).get()
    this.setData({
      discountList: res.data
    })
  },
  // 获取推荐书籍
  async getRecommend() {
    const {
      currentPage,
      pageSize,
      recommendList
    } = this.data
    const res = await bookCol.skip(currentPage * pageSize).limit(pageSize).get()
    this.setData({
      recommendList: recommendList.concat(res.data)
    })
  },
  // 加入购物车
  async addCar(event) {
    const {
      goods
    } = event.currentTarget.dataset
    // 给当前商品添加isSelect和counts属性
    goods.isSelect = true
    // 判断当前数据库中是否已经存在该书籍
    const res = await carCol.doc(goods._id).get()
    if (res.data) {
      let {
        counts
      } = res.data
      // 说明当前书籍已经存在购物车,则更新购物车书籍数量
      await carCol.doc(goods._id).update({
        data: {
          counts: counts + 1
        }
      }).then(() => {
        wx.showToast({
          title: '添加购物车成功',
          icon: 'success',
          mask: true
        })
      })
    } else {
      goods.counts = 1
      carCol.add({
        data: goods
      }).then(res => {
        wx.showToast({
          title: '添加购物车成功',
          icon: 'success',
          mask: true
        })
      })
    }

  },
  // 监听事件
  onClickBook(event) {
    const {
      id
    } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/detail-book/detail-book?id=${id}`,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 再从服务器拉取书籍数据
    // this.data.currentPage++
    // this.getRecommend()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})