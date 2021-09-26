import { fetchCoinList } from '@/apis/cryptocompare'
import { fetchSymbolsFullData } from '@/apis/cryptocompare'
import map from 'lodash/map'
import filter from 'lodash/filter'

export const state = {
  FSYM: 'BTC',
  TSYM: 'USDT',
  FSYMS: '',
  fsyms_list: {},
  binance_assets_list: {},
  assets_full_data: [],
}

export const getters = {}

export const mutations = {
  SET_SYMBOL(state, newValue) {
    state.FSYM = newValue.FSYM
    state.TSYM = newValue.TSYM
  },
  SET_FSYMS_LIST(state) {
    let fsyms = filter(state.binance_assets_list, (el) => {
      return el.tsyms.includes(state.TSYM)
    })

    let fsyms_list = map(fsyms, (el) => {
      return el.title
    })

    fsyms_list.length > 50 ? (fsyms_list.length = 50) : fsyms_list

    state.FSYMS = fsyms_list.toString()
    state.fsyms_list = fsyms_list
  },
  SET_COIN_LIST(state, newValue) {
    let coin_array = Object.entries(newValue)

    let new_binance_assets_list = map(coin_array, (el) => {
      return {
        title: el[0],
        tsyms: Object.keys(el[1].tsyms),
      }
    })
    state.binance_assets_list = new_binance_assets_list
  },
  async SET_SYMBOLS_FULL_DATA(state) {
    const { data } = await fetchSymbolsFullData({
      fsyms: state.FSYMS,
      tsyms: state.TSYM,
      e: 'binance',
    })
    let data_raw = data.RAW
    for (const key in data_raw) {
      state.assets_full_data.push(data_raw[key][`${state.TSYM}`])
    }
  },
}

export const actions = {
  init({ state, commit, dispatch }) {
    Promise.all([dispatch('getCoinList')])
      .then(() => {
        dispatch('getFsymsList')
      })
      .then(() => {
        dispatch('getSymbolsFullData')
      })
      .then(() => {
        let payload = {
          type: 2,
          fsyms: state.FSYMS,
        }
        commit('socket/CREATE_CHANNEL_STRING', payload, {
          root: true,
        })
      })
      .catch((e) => {
        console.log(e)
      })
  },

  async getCoinList({ commit }) {
    // Binance 기준 거래 통화
    const { data } = await fetchCoinList({ e: 'Binance' })
    commit('SET_COIN_LIST', data.Data.exchanges.Binance.pairs)
  },
  getFsymsList({ commit }) {
    commit('SET_FSYMS_LIST')
  },
  getSymbolsFullData({ commit }) {
    commit('SET_SYMBOLS_FULL_DATA')
  },
  updateSymbol({ commit }, newValue) {
    commit('SET_SYMBOL', newValue)
  },
}
