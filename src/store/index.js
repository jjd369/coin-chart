import Vue from 'vue'
import Vuex from 'vuex'
import dispatchActionInit from '@/utils/dispatch_action_init'
let apiKey = '917c161eac7536a4d1790a0d5468eac451a6737add2557c599f1c988a0c614eb'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    socket: new WebSocket(
      'wss://streamer.cryptocompare.com/v2?api_key=' + apiKey
    ),
    channel_string: [
      '0~Coinbase~BTC~USD',
      '2~Coinbase~BTC~USD',
      '30~Binance~BTC~USDT',
    ],
  },
  mutations: {
    socket_send(state) {
      state.socket.onopen = () => {
        state.socket.send(
          JSON.stringify({
            action: 'SubAdd',
            subs: state.channel_string,
          })
        )
      }
      console.log('send')
    },
  },
  actions: {
    init({ dispatch }) {
      Promise.all([
        dispatch('sendMessage').catch((e) => {
          console.log(e)
        }),
      ])
    },
    sendMessage({ commit }) {
      commit('socket_send')
    },
  },
  modules: {},
})

dispatchActionInit('init')
