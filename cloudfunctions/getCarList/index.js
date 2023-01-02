// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()
const bookCol = db.collection('book')
// 云函数入口函数
exports.main = async (event, context) => {
  const {
    ids
  } = event
  // 根据ids从bookCol中捞数据
  const tasks = []
  for (let i = 0; i < ids.length; i++) {
    const promise = bookCol.doc(ids[i]).get()
    tasks.push(promise)
  }
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    console.log(acc,cur)
    return {
      data: acc.data.concat(cur.data),
      errMsg: cur.errMsg,
    }
  },{data:[]})
}