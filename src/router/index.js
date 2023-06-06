import { createRouter, createWebHistory } from 'vue-router'

import AuthGuard from './guards/auth.guard'
import AnonymousGuard from './guards/anonymous.guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'ChatList',
      component: () => import('../views/ChatList.view.vue'),
      beforeEnter: (to) => AuthGuard(to, router)
    },
    {
      path: '/chat/:id',
      component: () => import('../views/ChatView.view.vue'),
      name: 'Chat',
      beforeEnter: (to) => AuthGuard(to, router)
    },
    {
      path: '/login',
      name: 'Login',
      // @ts-ignore
      component: () => import('../views/LoginView.view.vue'),
      beforeEnter: (to) => AnonymousGuard(to, router)
    },
    {
      path: '/sign-up',
      name: 'Register',
      // @ts-ignore
      component: () => import('../components/SignUp.component.vue')
    }
  ]
})

export default router
