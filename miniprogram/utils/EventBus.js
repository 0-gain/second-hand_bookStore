export default class EventBus {
  constructor() {
    this.list = {}
  }
  $on(fnName, callback) {
    if (!this.list[fnName]) {
      this.list[fnName] = []
    }
    // 把回调添加到队列里
    this.list[fnName].push(callback)
  }

  $emit(fnName, data = null) {
    let list = this.list[fnName]
    if (!list || !list.length) return false
    // 遍历发布消息
    list.forEach(fn => fn(data))
  }
}