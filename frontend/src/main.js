import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from '@/store/index'; // store

import 'vuetify/dist/vuetify.min.css' // Vuetify CSS

import axios from 'axios'
import VueAxios from 'vue-axios'

import io from 'socket.io-client'

const socket = io('http://127.0.0.1:8000', { withCredentials: true });     //socket 연결 요청
Vue.prototype.$socket = socket;                 //Vue component에서 쓸 수 있도록 Vue에 등록

Vue.use(VueAxios, axios)

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()  // 이벤트 버스용 빈 인스턴스

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
