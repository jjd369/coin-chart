import _ from 'lodash'

export const state = {
  connected: false,
  error: null,
  order_book: {},
  trade: {},
  ticker: {},
  channel_string: [
    '0~Binance~BNB~BTC',
    '2~Binance~BNB~BTC',
    '30~Binance~BNB~BTC',
  ],
}

export const getters = {
  displayOrderBook: (state) => state.order_book,
  displayTrade: (state) => state.trade,
  displayTicker: (state) => state.ticker,
}

export const mutations = {
  CREATE_CHANNEL_STRING(state, payload) {
    let channel_string
    channel_string = _.chain(payload.fsyms)
      .split(',')
      .map((el) => {
        return `${payload.type}~Binance~${el}~BTC`
      })
      .value()
    state.channel_string = [...state.channel_string, ...channel_string]
  },
  ADD_MESSAGE(state, message) {
    if (message.TYPE === '30') state.order_book = message
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
}
