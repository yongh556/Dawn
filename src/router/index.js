import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Splash',
    component: () => import('../views/Splash.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/app/qianfengji',
    name: 'Qianfengji',
    component: () => import('../apps/qianfengji/App.vue')
  },
  {
    path: '/app/qianfengji/chat/:id',
    name: 'QianfengjiChat',
    component: () => import('../apps/qianfengji/Chat.vue')
  },
  {
    path: '/app/qianfengji/novel/:id',
    name: 'QianfengjiNovelChat',
    component: () => import('../apps/qianfengji/NovelChat.vue')
  },
  {
    path: '/app/qianfengji/masks',
    name: 'QianfengjiMasks',
    component: () => import('../apps/qianfengji/Masks.vue')
  },
  {
      path: '/app/qianfengji/memory-pool',
      name: 'QianfengjiMemoryPool',
      component: () => import('../apps/qianfengji/MemoryPool.vue')
    },
    {
      path: '/app/qianfengji/profile/:id',
      name: 'QianfengjiPartnerProfile',
      component: () => import('../apps/qianfengji/CharacterProfile.vue')
    },
    {
      path: '/app/qianfengji/chat-settings',
      name: 'QianfengjiChatSettings',
      component: () => import('../apps/qianfengji/ChatSettings.vue')
    },
    {
      path: '/app/qianfengji/add-friend',
      name: 'QianfengjiAddFriend',
      component: () => import('../apps/qianfengji/AddFriend.vue')
    },
  {
    path: '/app/tonghangzhe',
    name: 'Tonghangzhe',
    component: () => import('../apps/tonghangzhe/App.vue')
  },
  {
    path: '/app/tonghangzhe/edit/:id?',
    name: 'TonghangzheEdit',
    component: () => import('../apps/tonghangzhe/Edit.vue')
  },
  {
    path: '/app/shujishi',
    name: 'Shujishi',
    component: () => import('../apps/shujishi/App.vue')
  },
  {
    path: '/app/shijieshu',
    name: 'Shijieshu',
    component: () => import('../apps/shijieshu/App.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
