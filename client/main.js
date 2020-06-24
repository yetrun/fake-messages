import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import routes from './routes'
import './filters'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import './global.css'
import axios from 'axios'

axios.defaults.baseURL = '/api'

Vue.use(VueRouter)
Vue.use(ViewUI)

const router = new VueRouter({
  routes
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
