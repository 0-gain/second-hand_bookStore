// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()
// 获取数据的最大条数
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {
  // 获取集合的名称
  const {
    collectionName
  } = event
  // 获取当前集合的总数
  const countRes = await db.collection(collectionName).count()
  const total = countRes.total
  // 计算需要分几次取出
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的promise的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection(collectionName).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有promise,获取集合中的所有数据
  return (await Promise.all(tasks)).reduce((prev, cur) => {
    return {
      data: prev.data.concat(cur.data),
      errMsg: prev.errMsg
    }
  })
}