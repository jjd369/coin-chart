import Vue from 'vue'
import Vuex from 'vuex'

let apiKey = '917c161eac7536a4d1790a0d5468eac451a6737add2557c599f1c988a0c614eb'
let socket = new WebSocket(
  'wss://streamer.cryptocompare.com/v2?api_key=' + apiKey
)
socket.onopen = () => {
  console.log('vuex websocket open')
}

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: tlqkf(),
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false,
      socket_channel: '',
    },
  },
  mutations: {
    socket_send() {
      socket.send(
        JSON.stringify({
          action: 'SubAdd',
          subs: ['0~Coinbase~BTC~USD'],
        })
      )
    },
    socket_onmessage(state) {
      socket.onmessage = (data) => {
        state.message = data
        console.log(data)
      }
    },
  },
  actions: {
    init: ({ dispatch }) => {
      Promise.all([
        dispatch('sendMessage').catch((e) => {
          console.log(e)
        }),
      ])
    },

    reciveMessage: ({ commit }) => {
      commit('socket_onmessage')
    },
    sendMessage: ({ commit }) => {
      commit('socket_send')
    },
  },
  modules: {},
})
function tlqkf() {
  socket.onmessage = (data) => {
    console.log('tlqkf')
    return data
  }
}
