import debounce from '../../utils/debounce'
const db = wx.cloud.database()
const userCol = db.collection('user')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    label: {
      type: String,
      value: "用户名"
    },
    type: {
      type: String,
      value: 'username'
    }
  },
  relations: {
    '../verifyForm/verifyForm': {
      type: 'parent',
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 错误信息提示
    errorMsg: '',
    // 输入的值
    value: '',
    // 是否重复
    isRepeat: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 输入发生改变
    onChange: debounce(function (event) {
      const {
        value
      } = event.detail
      this.data.value = value
      let _this = this
      _this.checkFn()
    }),
    onBlur() {
      const {
        value,
        type
      } = this.data
      if (!value || !value.trim()) {
        this.setData({
          errorMsg: '该字段不能为空'
        })
        return false
      } else {
        this.setData({
          value: value.trim()
        })
        // 将输入的内容传递给父组件
        this.triggerEvent('cpnClick', {
          type,
          value
        })
        return true
      }
    },
    async checkFn() {
      const {
        value,
        type
      } = this.data
      let _this = this
      if (type !== 'username') {
        await _this.queryData({
          [type]: value
        })
      }
      const {
        isRepeat
      } = this.data
      let isVerify = true
      switch (type) {
        case "username":
          if (value.length < 2 || value.length > 6) {
            this.setData({
              errorMsg: '用户名长度需要在2-6位之间'
            })
            return {isVerify:false,errorMsg:'用户名格式错误'}
          } else {
            this.setData({
              errorMsg: ''
            })
          }
          break;
        case "phone":
          const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/
          if (!phoneReg.test(value)) {
            this.setData({
              errorMsg: '手机号格式错误'
            })
            isVerify = false
          } else if (isRepeat) {
            this.setData({
              errorMsg: '手机号已被注册'
            })
            isVerify = false
          } else {
            this.setData({
              errorMsg: ''
            })
          }
          break
        case "studentId":
          const idReg = /^\w{6,20}$/g

          if (!idReg.test(value)) {
            this.setData({
              errorMsg: '学号由6-20位数字、字母组成'
            })
            return {isVerify:false,errorMsg:'学号格式错误'}
          } else if (isRepeat) {
            this.setData({
              errorMsg: '学号已被注册'
            })
            isVerify = false
          } else {
            this.setData({
              errorMsg: ''
            })
          }
          break
        case "email":
          const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          if (!emailReg.test(value)) {
            this.setData({
              errorMsg: '邮箱格式错误'
            })
            isVerify = false
          } else if (isRepeat) {
            this.setData({
              errorMsg: '邮箱已被注册'
            })
            isVerify = false
          } else {
            this.setData({
              errorMsg: ''
            })
          }
          break
        default:
          break
      }
      return {
        isVerify,
        errorMsg: this.data.errorMsg
      }
    },
    // 查询当前的值是否已经存在数据库中
    async queryData(condition) {
      const res = await userCol.where(condition).get()
      if (!res.data.length) {
        this.data.isRepeat = false
        return
      }
      if (this.data.type === 'studentId') {
        this.data.isRepeat = true
      } else if (this.data.type === 'phone') {
        this.data.isRepeat = true
      } else if (this.data.type === 'email') {
        this.data.isRepeat = true
      }
    }
  }
})