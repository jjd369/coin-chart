import historyProvider from './historyProvider'
import stream from './stream'
const supportedResolutions = [
  '1',
  // '3',
  // '5',
  // '15',
  // '30',
  '60',
  '120',
  '240',
  // 'D',
]

const config = {
  supported_resolutions: supportedResolutions,
}

export default {
  onReady: (cb) => {
    console.log('=====onReady running')
    setTimeout(() => cb(config), 0)
  },
  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    console.log('====Search Symbols running')
  },
  resolveSymbol: (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback,
    extension
  ) => {
    // expects a symbolInfo object in response
    console.log('======resolveSymbol running')

    var symbol_stub = {
      name: symbolName,
      description: '',
      type: 'crypto',
      session: '24x7',
      timezone: 'Asia/Seoul',
      ticker: symbolName,
      exchange: 'Coinbase',
      minmov: 1,
      pricescale: 100000000,
      has_intraday: true,
      intraday_multipliers: ['1', '60'],
      supported_resolution: supportedResolutions,
      volume_precision: 8,
      data_status: 'streaming',
    }

    setTimeout(function () {
      onSymbolResolvedCallback(symbol_stub)
      console.log('Resolving that symbol....', symbol_stub)
    }, 0)
  },
  getBars: function (
    symbolInfo,
    resolution,
    periodParams,
    onHistoryCallback,
    onErrorCallback
  ) {
    console.log('=====getBars running')
    historyProvider
      .getBars(symbolInfo, resolution, periodParams)
      .then((bars) => {
        if (bars.length) {
          onHistoryCallback(bars, { noData: false })
        } else {
          onHistoryCallback(bars, { noData: true })
        }
      })
      .catch((err) => {
        console.log({ err })
        onErrorCallback(err)
      })
  },
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback
  ) => {
    console.log('=====subscribeBars runnning')
    stream.subscribeBars(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscriberUID,
      onResetCacheNeededCallback
    )
  },
  unsubscribeBars: (subscriberUID) => {
    console.log('=====unsubscribeBars running')

    // stream.unsubscribeBars(subscriberUID)
  },
  getMarks: (symbolInfo, from, to, onDataCallback, resolution) => {
    //optional
    console.log('=====getMarks running')
  },
  getTimeScaleMarks: (symbolInfo, from, to, onDataCallback, resolution) => {
    //optional
    console.log('=====getTimeScaleMarks running')
  },
  getServerTime: (cb) => {
    console.log('=====getServerTime running')
  },
}
