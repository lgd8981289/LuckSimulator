import { createApp } from 'vue'
import App from './App.vue'
import components from './components'
import './assets/main.css'
import 'virtual:svg-icons-register'

createApp(App).use(components).mount('#app')
