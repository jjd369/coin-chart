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
  SET_FSYMS_LIST(state, fsyms) {
    state.FSYMS = fsyms.toString()
    state.fsyms_list = fsyms
  },
  SET_COIN_LIST(state, newValue) {
    state.binance_assets_list = newValue
  },
  SET_SYMBOLS_FULL_DATA(state, data) {
    for (const key in data) {
      state.assets_full_data.push(data[key][`${state.TSYM}`])
    }
  },
}

export const actions = {
  async init({ state, dispatch }) {
    try {
      const coins = await dispatch('getCoinList')
      const fsyms = await dispatch('getFsymsList', coins)
      await dispatch('getSymbolsFullData', fsyms.toString())

      let payload = {
        type: 2,
        fsyms: fsyms.toString(),
        tsym: state.TSYM,
      }
      dispatch('socket/addChannelString', payload, {
        root: true,
      })
    } catch (err) {
      console.log(err)
    }
  },

  async getCoinList({ commit }) {
    // Binance 기준 거래 통화
    const {
      data: {
        Data: {
          exchanges: {
            Binance: { pairs },
          },
        },
      },
    } = await fetchCoinList({ e: 'Binance' })

    let coin_array = Object.entries(pairs)

    let new_binance_assets_list = map(coin_array, (el) => {
      return {
        title: el[0],
        tsyms: Object.keys(el[1].tsyms),
      }
    })
    commit('SET_COIN_LIST', new_binance_assets_list)

    return new_binance_assets_list
  },
  async getFsymsList({ commit, state }, coins) {
    let fsyms = filter(coins, (el) => {
      return el.tsyms.includes(state.TSYM)
    })

    let fsyms_list = map(fsyms, (el) => {
      return el.title
    })

    fsyms_list.length > 40 ? (fsyms_list.length = 40) : fsyms_list

    commit('SET_FSYMS_LIST', fsyms_list)

    return fsyms_list
  },
  async getSymbolsFullData({ commit, state }, fsyms) {
    const {
      data: { RAW },
    } = await fetchSymbolsFullData({
      fsyms,
      tsyms: state.TSYM,
      e: 'binance',
    })
    commit('SET_SYMBOLS_FULL_DATA', RAW)
  },
  updateSymbol({ commit }, newValue) {
    commit('SET_SYMBOL', newValue)
  },
}
