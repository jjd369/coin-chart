import Vue from 'vue'
import Vuex from 'vuex'
import dispatchActionInit from '@/utils/dispatch_action_init'
import { getCoinList } from '@/apis/cryptocompare'
import filter from 'lodash/filter'
import findKey from 'lodash/findKey'
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
    coin_list: {},
    FSYM: 'BTC',
    TSYM: 'USDT',
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
    set_coin_list(state, newValue) {
      console.log(newValue)
      let test = filter(newValue, (val) => {
        return !findKey(val.tsyms, state.TSYM)
      })
      console.log(test)
      state.coin_list = newValue
    },
    set_symbol(state, FSYM, TSYM) {
      state.FSYM = FSYM
      state.TSYM = TSYM
    },
  },
  actions: {
    init({ dispatch }) {
      Promise.all([dispatch('sendMessage'), dispatch('getCoinList')]).catch(
        (e) => {
          console.log(e)
        }
      )
    },
    sendMessage({ commit }) {
      commit('socket_send')
    },
    async getCoinList({ commit }) {
      // Binance 기준 거래 통화
      const { data } = await getCoinList({ e: 'Binance' })
      commit('set_coin_list', data.Data.exchanges.Binance.pairs)
    },
    updateSymbol({ commit }, FSYM, TSYM) {
      commit('set_symbol', FSYM, TSYM)
    },
  },
  modules: {},
})

dispatchActionInit('init')
