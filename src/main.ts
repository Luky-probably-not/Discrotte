import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/base.css';

const piniaStore = createPinia();

createApp(App).use(piniaStore).use(router).mount('#app')
