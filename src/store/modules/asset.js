import { fetchCoinList } from '@/apis/cryptocompare'
import map from 'lodash/map'
import filter from 'lodash/filter'
import { fetchSymbolsFullData } from '@/apis/cryptocompare'

export const state = {
  FSYM: 'BNB',
  TSYM: 'BTC',
  FSYMS: '',
  fsyms_list: {},
  coin_list: {},
  symbols_full_data: [],
}

export const getters = {
  displayFsymsList: (state) => {
    let fsyms = filter(state.coin_list, (el) => {
      return el.tsyms.includes(state.TSYM)
    })

    let fsyms_list = map(fsyms, (el) => {
      return el.title
    })

    fsyms_list.length > 100 ? (fsyms_list.length = 100) : fsyms_list

    return fsyms_list
  },
  displayFsyms: (state, getters) => {
    return getters.displayFsymsList.toString()
  },
}

export const mutations = {
  SET_FSYMS_LIST(state) {
    let fsyms = filter(state.coin_list, (el) => {
      return el.tsyms.includes(state.TSYM)
    })

    let fsyms_list = map(fsyms, (el) => {
      return el.title
    })

    fsyms_list.length > 100 ? (fsyms_list.length = 100) : fsyms_list

    state.FSYMS = fsyms_list.toString()
    state.fsyms_list = fsyms_list
  },
  SET_COIN_LIST(state, newValue) {
    let coin_array = Object.entries(newValue)

    let new_coin_list = map(coin_array, (el) => {
      return {
        title: el[0],
        tsyms: Object.keys(el[1].tsyms),
      }
    })
    state.coin_list = new_coin_list
  },
  async SET_SYMBOLS_FULL_DATA(state, newVal) {
    const { data } = await fetchSymbolsFullData({
      fsyms: state.FSYMS,
      tsyms: state.TSYM,
    })

    state.symbols_full_data = data.RAW
  },
}

export const actions = {
  init({ dispatch }) {
    Promise.all([dispatch('getCoinList')])
      // .then(dispatch('getSymbolsFullData'))
      .catch((e) => {
        console.log(e)
      })
  },

  async getCoinList({ commit }) {
    // Binance 기준 거래 통화
    const { data } = await fetchCoinList({ e: 'Binance' })
    commit('SET_COIN_LIST', data.Data.exchanges.Binance.pairs)
    commit('SET_FSYMS_LIST')
    commit('SET_SYMBOLS_FULL_DATA')
  },
}
