import {createApp} from 'vue';
import {createPinia} from 'pinia';
import App from '@/App.vue';
import '@/style.css';
import router from '@/router';
import Toast, { POSITION } from "vue-toastification";
import type { PluginOptions } from 'vue-toastification';
import "vue-toastification/dist/index.css";

const app = createApp(App);

// Toast options
const options: PluginOptions = {
    position: POSITION.TOP_RIGHT,
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
    maxToasts: 20,
    transition: "Vue-Toastification__fade",
}
app.use(Toast, options);

// Pinia
const pinia = createPinia();
app.use(pinia);

// Router
app.use(router);

// Mount the app
app.mount('#app');