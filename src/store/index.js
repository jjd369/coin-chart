import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import socket from './plugins/websockets'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules,
  plugins: [socket()],
})
export default store
