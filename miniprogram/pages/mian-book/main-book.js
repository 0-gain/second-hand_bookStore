// pages/mian-book/main-book.js
const db = wx.cloud.database()
const bannerCol = db.collection('banner')
const bookCol = db.collection('book')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    recommendList: []
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getBanner()
    this.getRecommend()
  },
  // 获取banner数据
  async getBanner() {
    const res = await bannerCol.get()
    this.setData({
      banner: res.data
    })
  },
  // 获取推荐图书
  async getRecommend() {
    const res = await bookCol.skip(0).limit(10).get()
    this.setData({
      recommendList:res.data
    })
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})