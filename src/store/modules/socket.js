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
}

export const mutations = {
  CREATE_CHANNEL_STRING(state, newValue) {
    state.channel_string = [...state.channel_string, ...newValue]
  },
  DELETE_CHANNEL_STRING(state, channelIndex) {
    state.channel_string.splice(channelIndex, 1)
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
  addChannelString({ commit }, message) {
    let channel_string

    if (message.type === 2) {
      channel_string = _.chain(message.fsyms)
        .split(',')
        .map((el) => {
          return `${message.type}~Binance~${el}~${message.tsym}`
        })
        .value()
    }

    if (message.type === 0) {
      channel_string = [
        `${message.type}~Binance~${message.fsym}~${message.tsym}`,
      ]
    }

    commit('CREATE_CHANNEL_STRING', channel_string)
  },
  deleteChannelString({ commit }, message) {
    let delect_channel_index = state.channel_string.findIndex(
      (el) => el === `${message.type}~Binance~${message.fsym}~${message.tsym}`
    )
    commit('DELETE_CHANNEL_STRING', delect_channel_index)
  },
}
