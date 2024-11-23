import { createApp } from 'vue'
import App from './App.vue'
import router from './src/router'
import './src/assets/main.css'
import { VueQueryPlugin } from '@tanstack/vue-query'
import DashboardLayout from './src/components/DashboardLayout.vue'
import EmptyLayout from './src/components/EmptyLayout.vue'

const app = createApp(App)
app.use(VueQueryPlugin)
app.component('DefaultLayout', DashboardLayout)
app.component('EmptyLayout', EmptyLayout)

app.use(router)
app.mount('#app')
