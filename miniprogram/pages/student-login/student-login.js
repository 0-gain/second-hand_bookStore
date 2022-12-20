import Toast from '@vant/weapp/toast/toast';

const db = wx.cloud.database()
const userCol = db.collection('user')
Page({
  data: {
    form: {
      username: '',
      studentId: '',
      schoolName: '请选择所在的学校',
      email: '',
      phone: ''
    },
    // 是否显示弹出层
    isShowPop: false,
    // picker内容
    columns: [],
  },

  // 显示弹出层
  onShowPopup() {
    // 获取集合中所有的数据
    wx.cloud.callFunction({
      name: "getCollectionData",
      data: {
        collectionName: 'school_info'
      }
    }).then(({
      result
    }) => {
      const columns = []
      const data = result.data
      // 遍历集合
      data.forEach(el => {
        columns.push(el.schoolName)
      });
      this.setData({
        columns,
        isShowPop: true
      })
    })
  },
  // 关闭弹出层
  onClose() {
    this.setData({
      isShowPop: false
    })
  },
  // picker的监听事件
  onChange(event) {
    const {
      value,
      index
    } = event.detail;
    Toast(`当前值：${value}，当前索引：${index}`)
  },
  onConfirm(event) {
    const {
      value
    } = event.detail;
    Toast(`学校名称为：${value}`);
    this.setData({
      "form.schoolName": value,
      isShowPop: false
    })
  },
  onCancel() {
    Toast('已取消');
    this.setData({
      isShowPop: false
    })
  },
  // input事件
  onInputBlur(event) {
    const {
      currentTarget: {
        dataset: {
          value: name
        }
      },
      detail: {
        value
      }
    } = event
    this.data.form[name] = value
  },
  // 点击登录
  onClickLogin() {
    // this.onhandleVerifyInputCnpt()
    wx.getUserProfile({
      desc: '获取用户登录',
    }).then(res=>{console.log(res)})
  },
  // 自定义事件
  onCpnClick(event) {
    const {
      type,
      value
    } = event.detail
    this.data.form[type] = value
  },
  // 调用子组件中的方法
  async onhandleVerifyInputCnpt() {
    const cnpts = this.selectAllComponents(".verifyInput")
    const blurArr = cnpts.map(cnpt => {
      return cnpt.onBlur()
    })

    if (blurArr.every(el => el === true)) {
      const arr = cnpts.map(cnpt => {
        return cnpt.checkFn()
      })
     const verifyArr =  await Promise.all(arr)
      if (verifyArr.every(el => el === true) && this.data.form.schoolName !== '请选择所在的学校') {
        Toast.loading({
          message: '加载中...',
          forbidClick: true,
          loadingType: 'spinner',
        });
        wx.getUserProfile({
          desc: "用于用户登录",
        }).then(res => {
          console.log(res)
          // 获取用户信息
          const userInfo = res.userInfo
          const {
            username,
            studentId,
            schoolName,
            phone,
            email
          } = this.data.form
          userCol.add({
            data: {
              userInfo,
              username,
              studentId,
              schoolName,
              phone,
              email
            }
          }).then(res => {
            wx.switchTab({
              url: '/pages/mian-profile/main-profile',
            })
          })
        })
      } else if (this.data.form.schoolName === '请选择所在的学校') {
        Toast.fail('请选择所在的学校');
      } else {
        Toast.fail('请按规范填写');
      }
    } else {
      Toast.fail('必填字段不能为空！');
    }
  }
})