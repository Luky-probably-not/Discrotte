import ChatPageView from '@/views/ChatPageView.vue';
import LoginPageView from '@/views/LoginPageView.vue';
import { createRouter, createWebHistory } from 'vue-router';


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
        }
        // {
        //     path: '/:pathMatch(.*)*', 
        //     name: 'NotFound', 
        //     component: NotFound
        // }
    ],
});