import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles.css'
import './vue-overrides.css'
createApp(App).use(router).mount('#app')
