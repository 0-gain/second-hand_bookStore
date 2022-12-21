// pages/update-profile/update-profile.js
const db = wx.cloud.database()
const userCol = db.collection('user')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    avatarUrl: '',
    nickname: ''
  },
  // 更新数据库
  updateUserCol() {
    wx.showLoading({
      title: '加载中',
    })
    userCol.where({
      _openid: this.data.openid
    }).update({
      data: {
        userInfo: {
          avatarUrl: this.data.avatarUrl
        },
        username: this.data.nickname
      }
    }).then(() => {
      wx.hideLoading()
    })
  },
  // 确认修改
  onConfirm() {
    this.updateUserCol()
  },
  // 自定义事件
  onCustomEvent(event) {
    const {
      type,
      value
    } = event.detail
    this.setData({
      [type]: value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取头像信息
    wx.cloud.callFunction({
      name: 'getOpenid'
    }).then(res => {
      const openid = res.result.openid
      this.setData({
        openid
      })
      userCol.where({
        _openid: openid
      }).get().then(res => {
        const user = res.data[0]
        this.setData({
          avatarUrl: user.userInfo.avatarUrl
        })
      })
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