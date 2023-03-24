import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/index';
import { setRem } from '@/utils/rem';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import 'vant/lib/index.css';
setRem();

const app = createApp(App);
app.use(router);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.mount('#app');
