export default function createWebSocketPlugin() {
  return async (store) => {
    try {
      // socket connect
      var ws = await startWebsocket()

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
      // sokcet close
      ws.onclose = async () => {
        // reconnect
        ws = await startWebsocket()

        ws.onmessage = (message) => {
          let data = JSON.parse(message.data)
          store.dispatch('socket/addMessage', data)
        }

        let subRequest = {
          action: 'SubAdd',
          subs: store.getters['socket/displayChannelSting'],
        }

        ws.send(JSON.stringify(subRequest))
      }
    } catch (err) {
      console.log(err)
    }
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
