import ChatPageView from '@/views/ChatPageView.vue';
import LoginPageView from '@/views/LoginPageView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useStore } from '@/store';

// Define routes
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

// Navigation guard to check authentication before each route change
router.beforeEach(async (to) => {
    const store = useStore()

    // Initialize Authentication
    if (store.tokenExpiry === 0) {
        await store.loadAuthInfo();
    }

    if (to.meta.requiresAuth && !store.isTokenValid) {
        return { name: "login" }
    }

    if (to.name === "login" && store.isTokenValid) {
        return { name: "home" }
    }
})

export default router
