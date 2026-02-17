import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const piniaStore = createPinia();

createApp(App).use(piniaStore).use(router).mount('#app')

