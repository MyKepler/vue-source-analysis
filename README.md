## 1、Vue 初始化过程
> **面试题**：new Vue(options) 发生了什么？

![img.png](https://cdn.nlark.com/yuque/0/2020/png/422501/1606378693533-10c9cc32-007b-4211-a6c3-4aed6fb0373f.png)
> 原型对象的`this`指向实例

1. 调用原型对象上的 `_init(options)` 方法并把用户所写的选项`options`传入
2. 处理组件配置项。
- 子组件：将深层次的属性挂载到 `$options` 上，减少运行时原型链的查找，提高执行效率。
- 根组件：从组件构造函数中解析配置对象`options`，并合并基类选项。然后与用户传递的 `options` 合并。出现相同配置项时，用户传递的options会覆盖相应的配置。
3. 初始化组件实关系属性（`$root,$parent,$children,$refs`）【`initLifecycle(vm)`】
4. 初始化自定义事件【`initEvents(vm)`】
5. 解析组件的插槽信息，得到 `vm.$slot`，处理渲染函数，得到 `vm.$createElement` 方法，即 h 函数【`initRender(vm)`】
6. 调用 `beforeCreate` 钩子函数【`callHook(vm, 'beforeCreate')`】
7. 初始化组件的 `inject` 配置项，得到 `result[key] = val` 形式的配置对象，然后对结果数据进行响应式处理，并代理每个 key 到 vm 实例【`initInjections(vm)`】
8. 数据响应式的重点，处理 `props、methods、data、computed、watch`【`initState(vm)`】
9. 解析组件配置项上的 `provide` 对象，将其挂载到 `vm._provided` 属性上【`initProvide(vm)`】
10. 调用 `created` 钩子函数【`callHook(vm, 'created')`】


## 2、响应式原理
> **面试题**：Vue 响应式原理是怎么实现的？
响应式的核心是通过 `Object.defineProperty` 拦截对数据的访问和设置。
响应式的数据分为两类：
- 对象，循环遍历对象的所有属性，为每个属性设置 `getter、setter`，以达到拦截访问和设置的目的，如果属性值依旧为对象，则递归为属性值上的每个 `key` 设置 `getter、setter`
	- 访问数据时 `(obj.key)` 进行依赖收集，在 `dep` 中存储相关的 watcher 【`defineReactive`函数】
	- 设置数据时由 `dep` 通知相关的 `watcher` 去更新
- 数组，增强数组的那 7 个可以更改自身的原型方法，然后拦截对这些方法的操作
	- 添加新数据时进行响应式处理，然后由 `dep` 通知 `watcher` 去更新
	- 删除数据时，也要由 `dep` 通知 `watcher` 去更新

> **面试题**：`methods`、`computed` 和 `watch` 有什么区别？

使用场景：
- `methods` 一般用于封装一些较为复杂的处理逻辑（同步、异步）
- `computed` 一般用于封装一些简单的同步逻辑，将经过处理的数据返回，然后显示在模版中，以减轻模版的重量
- `watch` 一般用于当需要在数据变化时执行异步或开销较大的操作

methods VS computed
> 在一次渲染中，有多个地方使用了同一个 `methods` 或 `computed` 属性，`methods` 会被执行多次，而 `computed` 的回调函数则只会被执行一次。

> 通过阅读源码我们知道，在一次渲染中，多次访问只会在第一次执行 `computed` 属性的回调函数，后续的其它访问，则直接使用第一次的执行结果（`watcher.value`），而这一切的实现原理则是通过对 `watcher.dirty` 属性的控制实现的。而 methods，每一次的访问则是简单的方法调用（`this.xxMethods`）。

computed VS watch
> 通过阅读源码我们知道，`computed` 和 `watch` 的本质是一样的，内部都是通过 `Watcher` 来实现的，其实没什么区别，非要说区别的化就两点：1、使用场景上的区别，2、`computed` 默认是懒执行的，切不可更改。

methods VS watch
> `methods` 和 `watch` 之间其实没什么可比的，完全是两个东西，不过在使用上可以把 `watch` 中一些逻辑抽到 `methods` 中，提高代码的可读性。