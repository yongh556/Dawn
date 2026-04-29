import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Desktop',
    component: () => import('../views/DesktopView.vue')
  },
  {
    path: '/app/qianfeng',
    name: 'QianFeng',
    component: () => import('../views/apps/QianFengApp.vue')
  },
  {
    path: '/app/chat/:roleId',
    name: 'Chat',
    component: () => import('../views/apps/ChatView.vue')
  },
  {
    path: '/app/tongxing',
    name: 'TongXing',
    component: () => import('../views/apps/TongXingApp.vue')
  },
  {
    path: '/app/shuji',
    name: 'ShuJi',
    component: () => import('../views/apps/ShuJiApp.vue')
  },
  {
    path: '/app/shijie',
    name: 'ShiJie',
    component: () => import('../views/apps/ShiJieApp.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
