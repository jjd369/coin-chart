let apiKey = '917c161eac7536a4d1790a0d5468eac451a6737add2557c599f1c988a0c614eb'
const socket = new WebSocket(
  'wss://streamer.cryptocompare.com/v2?api_key=' + apiKey
)

export default function createWebSocketPlugin() {
  return (store) => {
    socket.onopen = () => {
      store.dispatch('socket/connectionOpened')
    }

    socket.onmessage = (message) => {
      var data = JSON.parse(message.data)
      store.dispatch('socket/addMessage', data)
    }

    store.subscribe((mutation) => {
      if (mutation.type === 'socket/CREATE_CHANNEL_STRING') {
        let subRequest = {
          action: 'SubAdd',
          subs: store.state.socket.channel_string,
        }
        socket.send(JSON.stringify(subRequest))
      }
      if (mutation.type === 'socket/DELETE_CHANNEL_STRING') {
        let unSubRequest = {
          action: 'SubRemove',
          subs: [
            `${mutation.payload.type}~Binance~${mutation.payload.fsym}~${mutation.payload.tsym}`,
          ],
        }
        socket.send(JSON.stringify(unSubRequest))
      }
    })
  }
}
