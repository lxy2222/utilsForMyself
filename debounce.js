let isObject = function (value) {
  let type = typeof value
  return value !== null && (type === 'object' || type === 'function')
}
/**
 * 
 * @param {Function} func 需要被延迟执行的函数
 * @param  {Number} wait 等待的时间
 * @param {Object} options 自定义配置
 */
let debounce = function (func, wait, options) {
  let lastArgs, // 最后一次传入的参数
      lastThis, // 最后一次调用的this
      maxWait, // 
      result,
      timerId,
      lastCallTime
    let lastInvokeTime = 0
    let leading = false
    let maxing = false
    let trailing = true
    if (typeof func !== 'function') {
      return new Error('Expected a function')
    }
    wait = +wait || 0
    if (isObject(options)) {
      leading = !!options.leading // 是否在延迟开始前调用
      maxing = 'maxWait' in options
      maxWait = maxing ? Math.max(+options.maxWait || 0, wait): maxWait
      trailing = 'trailing' in options ? options.trailing : trailing
    }
    let invokeFunc = function (time) {
      // 调用函数
      const args = lastArgs
      const ctx = lastThis
      // 清空
      lastThis = lastArgs = undefined
      lastInvokeTime = time
      return func.apply(ctx, args)
    }
    let startTimer = function (pendingFunc, wait) {
      return window.setTimeout(pendingFunc, wait)
    }
    let cancelTimer = function (id) {
      window.clearTimeout(id)
    }
    let leadingEdge = function (time) {
      lastInvokeTime = time
      // 设置的是否到达等待时间的定时器
      timerId = startTimer(timerExpired, wait)
      // 如果提前执行的话那么提前执行
      return leading ? invokeFunc(time) : result
    }
    // 计算还需要等待的时间
    let remainingWait = function (time) {
      const timeSinceLastCall = time - lastCallTime
      const timeSinceLastInvoke = time - lastInvokeTime
      const timeWaiting = wait - timeSinceLastCall
      return maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting
    }
    // 判断是否可以执行函数
    let shouldInvoke = function (time) {
      const timeSinceLastCall = time - lastCallTime
      const timeSinceLastInvoke = time - lastInvokeTime
      return (lastCallTime === undefined || (timeSinceLastCall >= wait) || timeSinceLastCall < 0 || (maxing && timeSinceLastInvoke >= maxWait)) 
    }
    // 时间是否超过时间
    let timerExpired = function () {
      const time = Date.now()
      if (shouldInvoke(time)) {
        return trailingEdge(time)
      }
      timerId = startTimer(timerExpired, remainingWait(time))
    }
    let trailingEdge = function (time) {
      timerId = undefined
      if (trailing && lastArgs) {
        return invokeFunc(time)
      }
      lastArgs = lastThis = undefined
      return result
    }
    let cancel = function () {
      if (timerId !== undefined ) {
        cancelTimer(timerId)
      }
      lastInvokeTime = 0
      lastArgs = lastCallTime = lastThis = timerId = undefined
    }
    let flush = function () {
      return timerId === undefined ? result : trailingEdge(Date.now())
    }
  
    let pending = function () {
      return timerId !== undefined
    }
    // 主要过程
    let debounced = function (...args) {
      const time = Date.now()
      const isInvoking = shouldInvoke(time)
      lastArgs = args
      lastThis = this
      lastCallTime = time
      if (isInvoking) {
        // 表示第一次
        if (timerId === undefined) {
          return leadingEdge(lastCallTime)
        }
        if (maxing) {
          timerId = startTimer(timerExpired, wait)
          return invokeFunc(lastCallTime)
        }
      }
      if (timerId === undefined) {
        timerId = startTimer(timerExpired, wait)
      }
      return result
    }
    debounced.cancel = cancel
    return debounced
}
// console.log(debounce)
var test = setInterval(() => {
  console.log('test')
}, 30)
// setInterval(test, 30)
debounce(test, 5000)