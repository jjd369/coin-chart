var apiKey = '917c161eac7536a4d1790a0d5468eac451a6737add2557c599f1c988a0c614eb'
var socket

startWebsocket()

export default function createWebSocketPlugin() {
  return (store) => {
    // socket
    socket.onmessage = (message) => {
      let data = JSON.parse(message.data)
      store.dispatch('socket/addMessage', data)
    }

    store.subscribe((mutation) => {
      if (mutation.type === 'socket/CREATE_CHANNEL_STRING') {
        let subRequest = {
          action: 'SubAdd',
          subs: mutation.payload,
        }

        socket.send(JSON.stringify(subRequest))
      }
      if (mutation.type === 'socket/DELETE_CHANNEL_STRING') {
        let unSubRequest = {
          action: 'SubRemove',
          subs: mutation.payload,
        }
        socket.send(JSON.stringify(unSubRequest))
      }
    })
  }
}

function startWebsocket() {
  socket = new WebSocket(
    'wss://streamer.cryptocompare.com/v2?api_key=' + apiKey
  )
  // socket.onopen = () => {}
  socket.onclose = () => {
    // connection closed, discard old websocket and create a new one in 5s
    socket = null
    setTimeout(startWebsocket, 5000)
  }
}
