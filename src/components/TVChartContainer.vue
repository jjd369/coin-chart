<template>
<div>
<button @click="click()">click</button>
  <div class="TVChartContainer" :id="containerId" />
  </div>
</template>

<script>
import { widget } from '../../public/charting_library'
import Datafeed from '@/apis/tradingveiw'
import { OHLCV } from '@/apis/cryptocompare'
import historyProvider from '@/apis/tradingveiw/historyProvider'
import { mapState  } from 'vuex'


export default {
  name: 'TVChartContainer',
  props: {
    symbol: {
      default: 'BTC/USD',
      type: String,
    },
    interval: {
      default: '60',
      type: String,
    },
    containerId: {
      default: 'tv_chart_container',
      type: String,
    },
    libraryPath: {
      default: '/charting_library/',
      type: String,
    },
    chartsStorageUrl: {
      default: 'https://saveload.tradingview.com',
      type: String,
    },
    chartsStorageApiVersion: {
      default: '1.1',
      type: String,
    },
    clientId: {
      default: 'tradingview.com',
      type: String,
    },
    userId: {
      default: 'public_user_id',
      type: String,
    },
    fullscreen: {
      default: false,
      type: Boolean,
    },
    autosize: {
      default: true,
      type: Boolean,
    },
    studiesOverrides: {
      type: Object,
    },
  },
  tvWidget: null,
  data() {
    return {
    }
  },
  computed:{
    ...mapState(['message'])
  },
  watch:{
    message(newValue, oldValue){
      console.log(newValue)
    }
  },
  mounted() {
    const widgetOptions = {
      symbol: this.symbol,
      datafeed: Datafeed,
      interval: this.interval,
      container: this.containerId,
      library_path: this.libraryPath,
      locale: 'ko',
      disabled_features: ['use_localstorage_for_settings'],
      client_id: this.clientId,
      user_id: this.userId,
      fullscreen: this.fullscreen,
      autosize: this.autosize,
      studies_overrides: this.studiesOverrides,
    }
    const tvWidget = new widget(widgetOptions)
    this.tvWidget = tvWidget
  },
  methods: {
    click(){
      var subRequest = {
        "action": "SubAdd",
        "subs": ["30~Binance~BTC~USDT"]
    };
      this.$store.dispatch('sendMessage', subRequest)
    },
  //   dataFeed() {
  //     const supportedResolutions = [
  //       '1',
  //       // '3',
  //       // '5',
  //       // '15',
  //       // '30',
  //       '60',
  //       '120',
  //       '240',
  //       // 'D',
  //     ]

  //     const config = {
  //       supported_resolutions: supportedResolutions,
  //     }

  //     var that = this

  //     const datafeed = {
  //       onReady: (cb) => {
  //         console.log('=====onReady running')
  //         setTimeout(() => cb(config), 0)
  //       },
  //       searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
  //         console.log('====Search Symbols running')
  //       },
  //       resolveSymbol: (
  //         symbolName,
  //         onSymbolResolvedCallback,
  //         onResolveErrorCallback,
  //         extension
  //       ) => {
  //         // expects a symbolInfo object in response
  //         console.log('======resolveSymbol running')

  //         var symbol_stub = {
  //           name: symbolName,
  //           description: '',
  //           type: 'crypto',
  //           session: '24x7',
  //           timezone: 'Asia/Seoul',
  //           ticker: symbolName,
  //           exchange: 'Coinbase',
  //           minmov: 1,
  //           pricescale: 100000000,
  //           has_intraday: true,
  //           intraday_multipliers: ['1', '60'],
  //           supported_resolution: supportedResolutions,
  //           volume_precision: 8,
  //           data_status: 'streaming',
  //         }

  //         setTimeout(function () {
  //           onSymbolResolvedCallback(symbol_stub)
  //           console.log('Resolving that symbol....', symbol_stub)
  //         }, 0)
  //       },
  //       getBars: (
  //         symbolInfo,
  //         resolution,
  //         periodParams,
  //         onHistoryCallback,
  //         onErrorCallback
  //       ) => {
  //         console.log('=====getBars running')
  //         historyProvider.getBars(symbolInfo, resolution, periodParams)
  //           .then((bars) => {
  //             if (bars.length) {
  //               onHistoryCallback(bars, { noData: false })
  //             } else {
  //               onHistoryCallback(bars, { noData: true })
  //             }
  //           })
  //           .catch((err) => {
  //             console.log({ err })
  //             onErrorCallback(err)
  //           })
  //       },
  //       subscribeBars: (
  //         symbolInfo,
  //         resolution,
  //         onRealtimeCallback,
  //         subscriberUID,
  //         onResetCacheNeededCallback
  //       ) => {
  //         console.log('=====subscribeBars runnning')
  //         // stream.subscribeBars(
  //         //   symbolInfo,
  //         //   resolution,
  //         //   onRealtimeCallback,
  //         //   subscriberUID,
  //         //   onResetCacheNeededCallback
  //         // )
  //       },
  //       unsubscribeBars: (subscriberUID) => {
  //         console.log('=====unsubscribeBars running')

  //         // stream.unsubscribeBars(subscriberUID)
  //       },
  //       getMarks: (symbolInfo, from, to, onDataCallback, resolution) => {
  //         //optional
  //         console.log('=====getMarks running')
  //       },
  //       getTimeScaleMarks: (symbolInfo, from, to, onDataCallback, resolution) => {
  //         //optional
  //         console.log('=====getTimeScaleMarks running')
  //       },
  //       getServerTime: (cb) => {
  //         console.log('=====getServerTime running')
  //       },
  //     }
  //     return datafeed
  //   },
  //   async historyProvider(symbolInfo, resolution, periodParams){
  //   const { countBack, firstDataRequest, to } = periodParams
  //   var split_symbol = this.symbol.split(/[:/]/)
  //   const histo =
  //     resolution === 'D'
  //       ? 'histoday'
  //       : resolution >= 60
  //       ? 'histohour'
  //       : 'histominute'

  //   const params = {
  //     fsym: split_symbol[0],
  //     tsym: split_symbol[1],
  //     toTs: to || '',
  //     limit: countBack < 2000 ? countBack : 2000,
  //     e: 'Coinbase',
  //   }

  //  return await OHLCV(params, histo) .then(({ data }) => {
  //     const { Data } = data

  //     if (!Data.Data.length) return []

  //     var bars = Data.Data.map((el) => {
  //       return {
  //         time: el.time * 1000, //TradingView requires bar time in ms
  //         low: el.low,
  //         high: el.high,
  //         open: el.open,
  //         close: el.close,
  //         volume: el.volumefrom,
  //       }
  //     })

  //     if (firstDataRequest) {
  //       var lastBar = bars[bars.length - 1]
  //       this.history[symbolInfo.name] = { lastBar: lastBar }
  //     }
  //     return bars
  //   })
  //   },
    destroyed() {
      if (this.tvWidget !== null) {
        this.tvWidget.remove()
        this.tvWidget = null
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.TVChartContainer {
  height: calc(100vh - 80px);
}
</style>
