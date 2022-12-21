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

    } = event.detail;
    Toast(`当前值：${value}`)
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
  // 自定义事件
  onCpnClick(event) {
    const {
      type,
      value
    } = event.detail
    this.data.form[type] = value
  },
  // 微信授权登录
  onFormSubmit(event) {
    if (!event.detail) return
    if (this.data.form.schoolName === '请选择所在的学校') {
      wx.showToast({
        title: '请选择学校名称',
        icon: 'error',
        duration: 2000
      })
      return
    }
    const {
      username,
      studentId,
      schoolName,
      phone,
      email
    } = this.data.form
    wx.showModal({
      title: '温馨提示',
      content: '需要授权微信登录后才可以正常使用小程序功能',
      success(res) {
        if (res.confirm) {
          wx.getUserProfile({
              desc: "用于用户登录",
            })
            .then(({
              userInfo
            }) => {
              console.log(userInfo)
              wx.showLoading({
                title: '加载中',
              })
              userCol.add({
                data: {
                  username,
                  schoolName,
                  studentId,
                  phone,
                  email,
                  userInfo
                }
              }).then(() => {
                wx.switchTab({
                  url: '/pages/mian-profile/main-profile',
                }).then(() => {
                  wx.hideLoading()
                }).catch(() => {
                  wx.showToast({
                    title: '登录失败',
                    icon: 'error',
                    duration: 2000
                  });
                })
              })
            }).catch(error => {
              wx.showToast({
                title: '您拒绝了授权',
                icon: 'error',
                duration: 2000
              });
              console.log(error, 'error')
            })
        } else if (res.cancel) {
          wx.showToast({
            title: '您拒绝了请求,不能正常使用小程序',
            icon: 'error',
            duration: 2000
          });
        }
      }
    })
  },
})