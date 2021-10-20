import Vue from 'vue'
import _ from 'lodash'

export const state = {
  connected: false,
  error: null,
  order_book: {},
  trade: {},
  ticker: {},
  channel_string: [],
}

export const getters = {
  displayOrderBook: (state) => state.order_book,
  displayTrade: (state) => state.trade,
  displayTicker: (state) => state.ticker,
  displayChannelSting: (state) => state.channel_string,
}

export const mutations = {
  CREATE_CHANNEL_STRING(state, newValue) {
    state.channel_string = [...state.channel_string, ...newValue]
  },
  DELETE_CHANNEL_STRING(state, message) {
    let index
    message.forEach((el) => {
      index = state.channel_string.findIndex((arr) => arr === el)
      state.channel_string.splice(index, 1)
    })
  },
  ADD_MESSAGE(state, data) {
    if (data.TYPE === '8') state.order_book = data
    if (data.TYPE === '0') {
      Vue.set(state.trade, [`${data.FSYM}/${data.TSYM}`], data)
    }
    if (data.TYPE === '2') state.ticker = data
  },

  SET_CONNECTION(state, message) {
    state.connected = message
  },
}

export const actions = {
  addMessage({ commit }, message) {
    commit('ADD_MESSAGE', message)
  },
  connectionOpened({ commit }) {
    commit('SET_CONNECTION', true)
  },
  addChannelString({ commit }, { type, fsyms, tsym }) {
    let create_string = []
    fsyms.forEach((el) => {
      create_string.push(`${type}~Binance~${el}~${tsym}`)
    })
    commit('CREATE_CHANNEL_STRING', create_string)
  },
  deleteChannelString({ commit }, { type, fsyms, tsym }) {
    let create_string = []
    fsyms.forEach((el) => {
      create_string.push(`${type}~Binance~${el}~${tsym}`)
    })
    commit('DELETE_CHANNEL_STRING', create_string)
  },
}
