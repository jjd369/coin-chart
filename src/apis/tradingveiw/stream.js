import historyProvider from './historyProvider.js'

let apiKey ='917c161eac7536a4d1790a0d5468eac451a6737add2557c599f1c988a0c614eb'
var ccStreamer = new WebSocket('wss://streamer.cryptocompare.com/v2?api_key=' + apiKey
)
let _subs = []
export default {
 subscribeBars: function(
  symbolInfo,
  resolution,
  onRealtimeCallback,
  uid,
  onResetCacheNeededCallback) {

    ccStreamer.onopen = () => {
        // make subRequest
    let channel = symbolInfo.name.split(/[:/]/)
    let subs = [`0~Coinbase~${channel[0]}~${channel[1]}`]
    let subRequest = {
      "action": "SubAdd",
      "subs": ['0~Coinbase~BTC~USD']
    }
      ccStreamer.send(JSON.stringify(subRequest))
      console.log('test')
    }

    const channelString = createChannelString(symbolInfo)
    var newSub = {
      channelString,
      uid,
      resolution,
      symbolInfo,
      lastBar: historyProvider.history[symbolInfo.name].lastBar,
      listener: onRealtimeCallback,
     }
   _subs.push(newSub)
 },
 unsubscribeBars: function(uid) {
  let subIndex = _subs.findIndex(e => e.uid === uid)
  if (subIndex === -1) {
   //console.log("No subscription found for ",uid)
   return
  }
  // let sub = _subs[subIndex]
  var subRequest = {
    "action": "SubRemove",
    "subs": ["0~Coinbase~BTC~USD"]
};
ccStreamer.send(JSON.stringify(subRequest));
  _subs.splice(subIndex, 1)
 }
}
ccStreamer.onmessage = (event) => {
  let data = JSON.parse(event.data)
  if(data.TYPE !== "0") return
  const channelString = `${data.TYPE}~${data.M}~${data.FSYM}~${data.TSYM}`

  const sub = _subs.find(e => e.channelString === channelString)
  if (sub) {
    // disregard the initial catchup snapshot of trades for already closed candles
    if (data.TS < sub.lastBar.time / 1000) return


    let _lastBar = updateBar(data, sub)
    // send the most recent bar back to TV's realtimeUpdate callback
    sub.listener(_lastBar)
    // update our own record of lastBar
    sub.lastBar = _lastBar
  }
}
function updateBar(data, sub) {
  let lastBar = sub.lastBar
  let resolution = sub.resolution
  if (resolution.includes('D')) {
   // 1 day in minutes === 1440
   resolution = 1440
  } else if (resolution.includes('W')) {
   // 1 week in minutes === 10080
   resolution = 10080
  }
 var coeff = resolution * 60
  // console.log({coeff})
  var rounded = Math.floor(data.TS / coeff) * coeff

  var lastBarSec = lastBar.time / 1000
  console.log('rounded',rounded)
  console.log('lastBarSec',lastBarSec)
  var _lastBar

 if (rounded > lastBarSec) {
   // create a new candle, use last close as open **PERSONAL CHOICE**
   _lastBar = {
    time: rounded * 1000,
    open: lastBar.close,
    high: lastBar.close,
    low: lastBar.close,
    close: data.P,
    volume: data.TOTAL
   }

  } else {
   // update lastBar candle!
   if (data.P < lastBar.low) {
    lastBar.low = data.P
   } else if (data.P > lastBar.high) {
    lastBar.high = data.P
   }

   lastBar.volume += data.TOTAL
   lastBar.close = data.P
   _lastBar = lastBar
  }
  return _lastBar
 }

 // takes symbolInfo object as input and creates the subscription string to send to CryptoCompare
 function createChannelString(symbolInfo) {
   var channel = symbolInfo.name.split(/[:/]/)
   const exchange = 'Coinbase'
   const to = channel[1]
   const from = channel[0]
  // subscribe to the CryptoCompare trade channel for the pair and exchange
   return `0~${exchange}~${from}~${to}`
 }
