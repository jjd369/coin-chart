import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import socket from './plugins/websockets'
import init from './plugins/actionInit'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules,
  plugins: [socket(), init()],
})

export default store
