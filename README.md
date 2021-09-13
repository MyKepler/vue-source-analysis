## 1、Vue 初始化过程
> **面试题**：new Vue(options) 发生了什么？

![img.png](https://cdn.nlark.com/yuque/0/2020/png/422501/1606378693533-10c9cc32-007b-4211-a6c3-4aed6fb0373f.png)
	原型对象的`this`指向实例

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
