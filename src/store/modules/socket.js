export const state = {
  connected: false,
  error: null,
  order_book: {},
  trade: {},
  limit: 5,
}

export const getters = {
  displayOrderBook: (state) => state.order_book,
  displayTrade: (state) => state.trade,
}

export const mutations = {
  ADD_MESSAGE(state, message) {
    if (message.TYPE === '30') state.order_book = message
    if (message.TYPE === '0') state.trade = message
  },
  DELETE_MESSAGE(state, message) {
    state.chatMessages = state.chatMessages.filter((m) => m.id !== message.id)
  },
  SET_CONNECTION(state, message) {
    state.connected = message
  },
  SET_ERROR(state, error) {
    state.error = error
  },
}

export const actions = {
  addMessage({ commit }, message) {
    commit('ADD_MESSAGE', message)
  },
  deleteMessage({ commit }, message) {
    commit('DELETE_MESSAGE', message)
  },
  connectionOpened({ commit }) {
    commit('SET_CONNECTION', true)
  },
  connectionClosed({ commit }) {
    commit('SET_CONNECTION', false)
  },
  connectionError({ commit }, error) {
    commit('SET_ERROR', error)
  },
}
