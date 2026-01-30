import { createRouter, createWebHistory } from 'vue-router';
import LoginPageView from '@/views/LoginPageView.vue';
import ChatPageView from '@/views/ChatPageView.vue'


export default createRouter({
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
            component: ChatPageView 
        },
        // {
        //     path: '/:pathMatch(.*)*', 
        //     name: 'NotFound', 
        //     component: NotFound
        // }
    ],
});