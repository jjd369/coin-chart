import historyProvider from './historyProvider.js'
import store from '@/store/index';
import Vue from 'vue'
const vm = new Vue()
// let apiKey = '917c161eac7536a4d1790a0d5468eac451a6737add2557c599f1c988a0c614eb'
// let ccStreamer = new WebSocket(
//   'wss://streamer.cryptocompare.com/v2?api_key=' + apiKey
// )

let _subs = []
export default {
  subscribeBars: function (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    uid,
    onResetCacheNeededCallback
  ) {
    const channelString = createChannelString(symbolInfo)

    let subRequest = {
      action: 'SubAdd',
      subs: [channelString],
    }

    setTimeout(()=>{
      store.dispatch('sendMessage', subRequest)
    }, 0)

    let newSub = {
      channelString,
      uid,
      resolution,
      symbolInfo,
      lastBar: historyProvider.history[symbolInfo.name].lastBar,
      listener: onRealtimeCallback,
    }
    _subs.push(newSub)
  },
  unsubscribeBars: function (uid) {
    let subIndex = _subs.findIndex((e) => e.uid === uid)

    if (subIndex === -1) return

    let sub = _subs[subIndex]

    let subRequest = {
      action: 'SubRemove',
      subs: [sub.channelString],
    }

    // ccStreamer.send(JSON.stringify(subRequest))

    _subs.splice(subIndex, 1)
  },
}
// 웹소켓 오픈
// ccStreamer.onopen = () => {
//   console.log('WebSocket is open now.')
// }
// // 웹소켓 메세지 수신
// ccStreamer.onmessage = (event) => {
//   let data = JSON.parse(event.data)
//   // 데이터 타입이 0이 아니면 리턴
//   if (data.TYPE !== '0') return

//   const channelString = `${data.TYPE}~${data.M}~${data.FSYM}~${data.TSYM}`
//   const sub = _subs.find((e) => e.channelString === channelString)
//   // sub이 없으면 리턴
//   if (!sub) return
//   // lastbar의 time보다 낮으면 리턴
//   if (data.TS < sub.lastBar.time / 1000) return
//   // 최산바 생성
//   let _lastBar = updateBar(data, sub)
//   // 최신 바 업데이트
//   sub.listener(_lastBar)
//   // sub의 lastbar 최신화
//   sub.lastBar = _lastBar
// }

// function updateBar(data, sub) {
//   let lastBar = sub.lastBar
//   let resolution = sub.resolution
//   // 1 day in minutes === 1440
//   // 1 week in minutes === 10080
//   resolution.includes('D')
//     ? (resolution = 1440)
//     : resolution.includes('W')
//     ? (resolution = 10080)
//     : resolution

//   var coeff = resolution * 60

//   var rounded = Math.floor(data.TS / coeff) * coeff

//   var lastBarSec = lastBar.time / 1000

//   var _lastBar = {}
//   // 새로운 캔들에 업데이트
//   if (rounded > lastBarSec) {
//     _lastBar = {
//       time: rounded * 1000,
//       open: lastBar.close,
//       high: lastBar.close,
//       low: lastBar.close,
//       close: data.P,
//       volume: data.TOTAL,
//     }
//     return _lastBar
//   }
//   // 마지막 캔들에  업데이트
//   data.P < lastBar.low
//     ? (lastBar.low = data.P)
//     : data.P > lastBar.high
//     ? (lastBar.high = data.P)
//     : null

//   lastBar.volume += data.Q
//   lastBar.close = data.P
//   _lastBar = lastBar

//   return _lastBar
// }

// takes symbolInfo object as input and creates the subscription string to send to CryptoCompare
function createChannelString(symbolInfo) {
  var channel = symbolInfo.name.split(/[:/]/)
  const exchange = 'Coinbase'
  const to = channel[1]
  const from = channel[0]
  // subscribe to the CryptoCompare trade channel for the pair and exchange
  return `0~${exchange}~${from}~${to}`
}
