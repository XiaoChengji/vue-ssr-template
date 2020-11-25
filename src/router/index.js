import Vue from 'vue'
import Router from 'vue-router'
import MainComponent from '@/views/main'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    scrollBehavior: () => ({y: 0}),
    routes: [
      {
        path: '/',
        redirect: '/index'
      },
      {
        path: '/index',
        name: 'MainPage',
        component: MainComponent,
      },
      {
        path: '/detail',
        name: 'DetailPage',
        component: () => import('@/views/detail'),
        children: [
            {
                path: 'second',
                component: () => import('@/views/detail/second'),
                children: [
                    {
                        path: 'third',
                        component: () => import('@/views/detail/third'),
                    }
                ]
            }
        ]
      }
    ]
  })
}
