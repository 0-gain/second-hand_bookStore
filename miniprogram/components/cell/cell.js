const db = wx.cloud.database()
const userCol = db.collection('user')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'text'
    },
    label: {
      type: String,
      value: '用户名'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 用户头像
    avatarUrl: '../../assets/images/default-avatar.jpg',
    // 用户唯一标识
    openid: '',
    // 用户昵称
    nickname: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 用户更换头像
    onChooseAvatar(event) {
      wx.showLoading({
        title: '加载中',
      })
      const {
        avatarUrl
      } = event.detail
      this.setData({
        avatarUrl
      })
      wx.hideLoading()
      // 向父组件传递数据
      const {
        type
      } = this.data
      this.triggerEvent('customEvent', {
        type,
        value: this.data[type]
      })
    },
    async getUserOpenid() {
      // 先获取用户的openid
      const res = await wx.cloud.callFunction({
        name: "getOpenid"
      })
      this.data.openid = res.result.openid
    },
    onBlur(event) {
      const {
        value
      } = event.detail
      this.data.nickname = value
      // 向父组件传递数据
      const {
        type
      } = this.data
      this.triggerEvent('customEvent', {
        type,
        value: this.data[type]
      })
    },
  },
  lifetimes: {
    created() {
      wx.showLoading({
        title: '加载中',
      })
    },
    attached() {
      // 在组件实例进入页面节点树时执行
      this.getUserOpenid().then(() => {
        userCol.where({
          _openid: this.data.openid
        }).get().then(res => {

          this.setData({
            avatarUrl: res.data[0].userInfo.avatarUrl,
            nickname: res.data[0].username
          })
        })
      })
    },
    ready() {
      wx.hideLoading()
    }
  },

})