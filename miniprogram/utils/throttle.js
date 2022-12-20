function throttle(fn, delay = 1000) {
  let startTime = Date.now()
  return function(...args){
    let nowTime = Date.now()
    if (nowTime - startTime >= delay) {
      fn.apply(this, args)
      startTime = Date.now()
    }
  }
}
export default throttle