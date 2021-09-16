/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

// 基于数组原型创建一个新对象 覆写增强方法
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

// 为什么是这七个啊？因为只有这七个是改变自身的方法，其他的比如contact是返回一个新的数组的
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  // 分别在arrayMethods定义这七个 方法
  def(arrayMethods, method, function mutator (...args) {
    // 先执行原生的方法
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // 入股增减元素，响应式处理
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
