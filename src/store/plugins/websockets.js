// ws.onclose = () => {
//   // connection closed, discard old websocket and create a new one in 5s
//   console.log(socket)
//   socket = null
//   setTimeout(
//     (socket = new WebSocket(
//       'wss://streamer.cryptocompare.com/v2?api_key=' + apiKey
//     )),
//     5000
//   )
// }

export default function createWebSocketPlugin() {
  return (store) => {
    // socket connect
    startWebsocket()
      .then((ws) => {
        // onmessage
        ws.onmessage = (message) => {
          let data = JSON.parse(message.data)
          store.dispatch('socket/addMessage', data)
        }
        store.subscribe((mutation) => {
          // create the channel string
          if (mutation.type === 'socket/CREATE_CHANNEL_STRING') {
            let subRequest = {
              action: 'SubAdd',
              subs: mutation.payload,
            }

            ws.send(JSON.stringify(subRequest))
          }
          // delete the channel string
          if (mutation.type === 'socket/DELETE_CHANNEL_STRING') {
            let unSubRequest = {
              action: 'SubRemove',
              subs: mutation.payload,
            }
            ws.send(JSON.stringify(unSubRequest))
          }
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }
}

function startWebsocket() {
  return new Promise((resolve, reject) => {
    const apiKey =
      '917c161eac7536a4d1790a0d5468eac451a6737add2557c599f1c988a0c614eb'
    let ws = new WebSocket(
      'wss://streamer.cryptocompare.com/v2?api_key=' + apiKey
    )
    ws.onopen = () => {
      resolve(ws)
    }
    ws.onerror = (err) => {
      reject(err)
    }
  })
}
