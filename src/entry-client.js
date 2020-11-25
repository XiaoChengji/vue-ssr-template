import Vue from 'vue'
import { createApp } from './app'
const { app, router, store } = createApp()

// 客户端支持数据预取，分为两种做法：
// 1. 在路由导航之前解析数据
// 2. 匹配要渲染的视图后，再获取数据(下述代码为此实现方式)

/**
 * 提示
 * 由于服务端已经数据预取，没必要执行客户端数据预取，下述代码仅作演示，会出现服务端和客户端各调用一次接口
 *
 * 建议使用服务端预取
 * 1. 客户端数据预取是需要等待加载完JS文件才可执行，和 SPA 页面一样，同样不利于SEO
 * 2. 客户端数据预取会导致浏览器发起请求，通过浏览器调试可发现请求接口，导致接口暴露，而且发起的请求同样受到浏览器跨域限制
 * 客户端数据预取应该用于加载非核心数据进行节点渲染，减轻服务器压力，提高页面加载速度方面
 */

/* 客户端数据预取演示代码 start */
// Vue.mixin({
//     beforeMount() {
//         console.log('mixin beforeMount')
//         const { asyncData } = this.$options
//         if (asyncData) {
//             // 将获取数据操作分配给 promise
//             // 以便在组件中，我们可以在数据准备就绪后
//             // 通过运行 `this.dataPromise.then(...)` 来执行其他任务
//             console.log('mixin beforeMount asyncData')
//             this.dataPromise = asyncData({
//                 store: this.$store,
//                 route: this.$route
//             })
//         }
//     },

//     beforeRouteUpdate(to, from, next) {
//         const { asyncData } = this.$options
//         if (asyncData) {
//             asyncData({
//                 store: this.$store,
//                 route: to
//             }).then(next).catch(next)
//         } else {
//             next()
//         }
//     }
// })
/* 客户端数据预取演示代码 end */

if (window.__INITIAL_STATE__) {
    // 将服务端预取的数据赋值给客户端的 vuex。
    store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
    // 服务端渲染出得 html 在浏览器渲染后，会有一个 `data-server-rendered="true"` 的标记，标明这部分 Dom 是服务端渲染的，浏览器端的代码准备好后就会接管这部分 Dom，使其重新变为一个单页应用。
    app.$mount('#app')
})
