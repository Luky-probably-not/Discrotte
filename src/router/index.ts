import ChatPageView from '@/views/ChatPageView.vue';
import LoginPageView from '@/views/LoginPageView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useStore } from '@/store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: "login",
      component: LoginPageView
    },
    {
      path: '/',
      name: "home",
      component: ChatPageView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to) => {
  const store = useStore()

  if (to.meta.requiresAuth && store.jwtToken === "") {
    return { name: "login" }
  }

  if (to.name === "login" && store.jwtToken !== "") {
    return { name: "home" }
  }
})

export default router
