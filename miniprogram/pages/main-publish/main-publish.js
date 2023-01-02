import debounce from '../../utils/debounce'
const tags = {
  小学: ['数学', '语文', '英语', '其他'],
  初中: ['数学', '语文', '英语', '物理', '生物', '化学', '其他'],
  高中: ['数学', '语文', '英语', '物理', '生物', '化学', '通用技术', '其他'],
  大学: ['考研', '英语四六级', '专升本', '计算机', '会计', '英语', '电子商务', '土木', '设计', '电气', '小语种', '其他'],
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ISDN: "",
    bookData: null,
    bookname: '',
    steps: [{
        text: '步骤一',
        desc: '扫描书本ISBN码',
      },
      {
        text: '步骤二',
        desc: '补充书籍信息',
      },
      {
        text: '步骤三',
        desc: '发布书籍',
      }
    ],
    active: 1,
    // 新旧程度
    condition: '',
    // 是否显示弹出层
    isShowPopup: false,
    // 是否为多列联动
    isMultCol: false,
    conditionsColumns: ['全新', '良好', '中等'],
    multColumns: [{
        values: Object.keys(tags),
        className: 'column1',
      },
      {
        values: tags['小学'],
        className: 'column2',
        defaultIndex: 1,
      }
    ],
    // 书本类型
    radioBookType: '1',
    // 专业
    major: '',
    // 原价
    oldPrice: '',
    // 二手价
    nowPrice: '',
    // 电话
    phone: '',
    // 书本描述
    description: '',
    // 交易类型
    radioTradeType: '1',
    rentPrice: "",
    // 图片信息
    fileList: []

  },

  // 点击扫码
  getIsdnCode() {
    wx.scanCode().then(res => {
      this.setData({
        ISDN: res.result
      })
      this.getBookData()
    }).catch((err) => {
      wx.showToast({
        title: '扫描失败',
        icon: 'error',
        mask: true
      })
    })
  },
  // 获取书籍数据
  getBookData() {
    const _this = this
    wx.request({
      url: `https://api.jike.xyz/situ/book/isbn/${this.data.ISDN}?apikey=14681.204811eea0f177f3b51fa59670f5aeb9.9e6f02b05ba699a780cfc34a0a03232a`,
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // 9787040406641
        wx.hideLoading()
        const data = res.data.data
        _this.setData({
          bookData: data,
          bookname: data.name,
          oldPrice: data.price,
          fileList: [{
            url: data.photoUrl
          }],
          active: 1
        })
        console.log(res)
      },
      fail(err) {
        wx.showToast({
          title: '获取失败',
          icon: 'error',
          mask: true
        });
      }
    })
  },
  // 点击确认
  onConfim() {
    const {
      ISDN
    } = this.data
    //判断书籍号是否正确
    if (!(/978[0-9]{10}/.test(ISDN))) {
      wx.showToast({
        title: '请扫描978开头的ISDN号',
        icon: 'none'
      });
      return false;
    }
    this.getBookData()
    wx.showLoading({
      title: '加载书籍信息',
    })
  },
  // 输入框失焦
  onInputBlur(e) {
    const {
      value
    } = e.detail
    this.setData({
      ISDN: value.trim()
    })
  },
  // picker
  onConfirmPicker(e) {
    const {
      value
    } = e.detail
    if (this.data.isMultCol) {
      this.setData({
        major: value,
        isShowPopup: false
      })
      return
    }
    this.setData({
      condition: value,
      isShowPopup: false
    })
  },
  // 新旧程度
  changePickStatus() {
    this.setData({
      isShowPopup: true,
      isMultCol: false
    })
  },
  onChangePicker(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    if (this.data.isMultCol) {
      picker.setColumnValues(1, tags[value[0]]);
    }
  },
  onClose() {
    this.setData({
      isShowPopup: false
    })
  },
  // 专业分类
  selectMajor() {
    this.setData({
      isShowPopup: true,
      isMultCol: true
    })
  },
  // 所属分类
  onChangeRadioStatus(e) {
    const {
      detail
    } = e
    this.setData({
      radioBookType: detail
    })
  },
  // 交易类型
  onChangeTradeType(e) {
    const {
      detail
    } = e
    this.setData({
      radioTradeType: detail
    })
  },
  // 书本描述
  onchangeBookDescription: debounce(function (e) {
    this.setData({
      description: e.detail
    })
  }),
  // 联系电话
  onchangePhone: debounce(function (e) {
    this.setData({
      phone: e.detail
    })
  }),
  // 租金
  onchangeRentPrice: debounce(function (e) {
    this.setData({
      rentPrice: e.detail
    })
  }),
  // 现价
  onchangeNowPrice: debounce(function (e) {
    this.setData({
      nowPrice: e.detail
    })
  }),
  // 原价
  onchangeOldPrice: debounce(function (e) {
    this.setData({
      oldPrice: e.detail
    })
  }),
  // 确认发布
  checkPublish() {
    // 验证
    const {
      condition,
      oldPrice,
      nowPrice,
      rentPrice,
      radioTradeType,
      phone
    } = this.data
    const priceReg = /^[1-9]\d*(.\d{1,2})?$/
    if (!condition) {
      wx.showToast({
        title: '请填写新旧程度',
        icon: 'error',
        mask: true
      })
      return
    }
    if (radioTradeType === '1') {
      if (!nowPrice) {
        wx.showToast({
          title: '请填写价格',
          icon: 'error',
          mask: true
        })
        return
      } else {
        // 二手价超过原价
        if (nowPrice > oldPrice) {
          wx.showToast({
            title: '请合理填写价格',
            icon: 'error',
            mask: true
          })
          return
        }

        if (!priceReg.test(nowPrice)) {
          wx.showToast({
            title: '价格格式有误',
            icon: 'error',
            mask: true
          })
          return
        }
      }
    } else if (radioTradeType === '2') {
      if (rentPrice > 3) {
        wx.showToast({
          title: '租价超过了3元',
          icon: 'error',
          mask: true
        })
        return
      }
    }
    if (!phone) {
      wx.showToast({
        title: '请填写手机号',
        icon: 'error',
        mask: true
      })
      return
    } else {
      const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!phoneReg.value(phone)) {
        wx.showToast({
          title: '手机号格式错误',
          icon: 'error',
          mask: true
        })
        return
      } else if (!priceReg.test(rentPrice)) {
        wx.showToast({
          title: '价格格式有误',
          icon: 'error',
          mask: true
        })
        return
      }
    }

    this.getPublishData()
    // this.setData({active:2})
  },
  // 获取发布数据
  getPublishData() {
    const {
      bookname,
      fileList,
      condition,
      major,
      radioBookType,
      nowPrice,
      oldPrice,
      radioTradeType,
      rentPrice,
      phone,
      description
    } = this.data
    // 书本类型
    let bookType = {}
    if (radioBookType === '1') {
      bookType.type = '通用类'
    } else {
      bookType.type = '专业书'
      bookType.grade = major[0]
      bookType.major = major[1]
    }
    // 交易类型
    let tradeType = {}
    if (radioTradeType === '1') {
      tradeType.type = '出售'
      tradeType.nowPrice = nowPrice
    } else {
      tradeType.type = '租借'
      tradeType.rentPrice = rentPrice
    }
    const publishData = {
      bookname,
      bookImage: fileList,
      condition,
      bookType,
      oldPrice,
      tradeType,
      phone,
      description
    }
    console.log(publishData)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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