function debounce(fn, delay = 500) {
  let timer
  return function(...args){
    if(timer) clearTimeout(timer)
    timer = setTimeout(()=>{
      fn.apply(this,args)
    },delay)
  }
}
export default debounce