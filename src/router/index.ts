import ChatPageView from '@/views/ChatPageView.vue';
import LoginPageView from '@/views/LoginPageView.vue';
import { connectedUser } from '@/ts/connectedUser';
import { createRouter, createWebHistory } from 'vue-router';

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
  const userStore = connectedUser()

  if (to.meta.requiresAuth && userStore.tokenJwt === "") {
    return { name: "login" }
  }

  if (to.name === "login" && userStore.tokenJwt !== "") {
    return { name: "home" }
  }
})

export default router