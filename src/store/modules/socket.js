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
  CREATE_CHANNEL_STRING(state, payload) {
    let channel_string

    if (payload.type === 2) {
      channel_string = _.chain(payload.fsyms)
        .split(',')
        .map((el) => {
          return `${payload.type}~Binance~${el}~${payload.tsym}`
        })
        .value()
      state.channel_string = [...state.channel_string, ...channel_string]
    }

    if (payload.type === 0) {
      channel_string = `${payload.type}~Binance~${payload.fsym}~${payload.tsym}`

      state.channel_string.push(channel_string)
    }
  },
  DELETE_CHANNEL_STRING(state, payload) {
    console.log(`${payload.type}~Binance~${payload.fsym}~${payload.tsym}`)
    let delect_channel_index = state.channel_string.findIndex(
      (el) => el === `${payload.type}~Binance~${payload.fsym}~${payload.tsym}`
    )
    state.channel_string.splice(delect_channel_index, 1)
  },
  ADD_MESSAGE(state, message) {
    if (message.TYPE === '8') state.order_book = message
    if (message.TYPE === '0') state.trade = message
    if (message.TYPE === '2') state.ticker = message
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
    commit('CREATE_CHANNEL_STRING', message)
  },
  deleteChannelString({ commit }, message) {
    commit('DELETE_CHANNEL_STRING', message)
  },
}
