import * as Vue from 'vue'
import { store } from '../store/store'
import App from '../components/App.vue'

const app = Vue.createApp(App)
app.use(store)

app.mount('#app')

