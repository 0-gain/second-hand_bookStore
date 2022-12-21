// components/verifyForm/verifyForm.js
Component({
  // 启用插槽
  options: {
    multipleSlots: true
  },
  relations: {
    '../verifyInput/verifyInput': {
      type: 'child',
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    relationNodes: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取所有的关联节点
    async getAllInput() {
      const nodes = this.getRelationNodes('../verifyInput/verifyInput')
      this.data.relationNodes = nodes
      const res = await this.handleCheck()
      return res
    },
    // 提交
    async onSubmit() {
      // 获取到插槽节点
      const res = await this.getAllInput()
      this.triggerEvent('submit', res)
    },
    // 处理校验
    async handleCheck() {
      // 获取失去焦点的校验数组
      const blurArr = this.data.relationNodes.map(c => c.onBlur())
      if (blurArr.every(el => el === true)) {
        // 获取字段格式的校验数组
        let verifyArr = this.data.relationNodes.map(c => c.checkFn())
        verifyArr = await Promise.all(verifyArr)
        if (verifyArr.every(el => el.isVerify === true)) {
          return true
        } else {
          let title = '请按规范填写'
          for (const item of verifyArr) {
            if (!item.isVerify) {
              title = item.errorMsg
              break
            }
          }
          wx.showToast({
            title,
            icon: 'error',
            duration: 2000,
            mask: true
          })
        }
      } else {
        wx.showToast({
          title: '字段不能为空',
          icon: 'error',
          duration: 2000,
          mask: true
        })
      }
    }
  },
})