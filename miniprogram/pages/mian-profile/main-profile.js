import Toast from '@vant/weapp/toast/toast';
const db = wx.cloud.database()
const userCol = db.collection('user')
Page({
  data: {
    user: null
  },
  // 事件监听
  onLogin() {
    // 用户点击登录
    Toast.loading({
      message: '正在登录...',
      forbidClick: true,
    });
    /* 
      1.微信授权
      2.查看当前用户是否存在数据库
    */
    wx.cloud.callFunction({
      name: 'getOpenid'
    }).then(({
      result
    }) => {
      userCol.where({
        _openid: result.openid
      }).get().then(res => {
        if (res.data.length) {
          Toast.clear()
          this.setData({
            user: res.data[0]
          })
        } else {
          this.ToLogn()
        }
      })
    }).catch(error => {
      Toast.fail('登录失败', error);
    })
  },
  // 跳转至登录页面
  ToLogn() {
    wx.navigateTo({
      url: "/pages/student-login/student-login"
    }).then(res => {
      console.log(res)
    })
  },
  onShow() {
    wx.cloud.callFunction({
      name: 'getOpenid'
    }).then(({
      result
    }) => {
      userCol.where({
        _openid: result.openid
      }).get().then(res => {
        if (res.data.length) {
          this.setData({
            user: res.data[0]
          })
        }
      })
    })
  },
})