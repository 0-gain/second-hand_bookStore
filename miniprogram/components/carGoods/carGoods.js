const db = wx.cloud.database()
const carCol = db.collection('carList')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goods: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    checked: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCheckboxChange() {
      this.setData({
        checked: !this.data.checked
      })
      // 更新商品的选中状态
      this.onChangeSelectStatus(this.data.checked)
    },
    async onChangeSelectStatus(isSelect) {
      const {
        _id
      } = this.data.goods
      const res = await carCol.doc(_id).update({
        data: {
          isSelect
        }
      })
      // 自定义事件
      this.triggerEvent('Event')
    },
    updateCheckedStatus() {
      this.setData({
        checked: this.data.goods.isSelect
      })
    },
    // 商品数量
    async onChange(e){
      const counts = e.detail
      const res = await carCol.doc(this.data.goods._id).update({
        data:{
          counts
        }
      })
      // 自定义事件
      this.triggerEvent('Event')
    }
  },
  lifetimes: {
    attached() {
      this.updateCheckedStatus()
    }
  }
})