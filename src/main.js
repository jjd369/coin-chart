import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import VueNativeSock from 'vue-native-websocket'

// let apiKey = '917c161eac7536a4d1790a0d5468eac451a6737add2557c599f1c988a0c614eb'

// Vue.use(
//   VueNativeSock,
//   'wss://streamer.cryptocompare.com/v2?api_key=' + apiKey,
//   { store: store }
// )

Vue.config.productionTip = false
Vue.use(Element)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
