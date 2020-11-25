import Vue from 'vue'
import App from './App.vue'
import { createRouter } from '@/router'
import { createStore } from '@/store'
import { sync } from 'vuex-router-sync'

export function createApp(context) { // 每一次返回新的实例，避免重复覆用
    const router = createRouter()
    const store = createStore()

    // 同步路由状态(route state)到 store
    sync(store, router)

    const app = new Vue({
        router,
        store,
        render: h => h(App)
    })
    
    return { app, router, store }
}