const db = wx.cloud.database()
const bookCol = db.collection('book')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 书的id
    _id: '',
    coverUrl: '',
    tempFileURL: '',
    bookData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 初始化_id
    const {
      id
    } = options
    this.setData({_id:id})
    this.getBookDetail()
    
  },
  // 获取书籍详情数据
  async getBookDetail() {
    wx.showLoading({
      title: '加载中...',
    })
    const res = await bookCol.doc(this.data._id).get()
    const bookData = res.data
    this.setData({bookData,coverUrl:res.data.fileId})
    this.getTempFileURL()
  },
  // 获取图片临时路径
  async getTempFileURL() {
    const res = await wx.cloud.getTempFileURL({
      fileList: [this.data.coverUrl]
    })
    const {
      tempFileURL
    } = res.fileList[0]
    this.setData({
      tempFileURL
    })
    wx.hideLoading()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

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