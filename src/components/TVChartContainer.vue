<template>
  <div>
    <div class="TVChartContainer" :id="containerId" />
  </div>
</template>

<script>
import { widget } from '../../public/charting_library'
import historyProvider from '@/utils/historyProvider'
import { mapGetters } from 'vuex'

export default {
  name: 'TVChartContainer',
  props: {
    symbol: {
      default: 'BNB/BTC',
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
      subs: [],
    }
  },
  computed: {
    ...mapGetters('socket', ['displayTrade']),
  },
  watch: {
    displayTrade(newValue) {
      const channelString = `${newValue.TYPE}~${newValue.M}~${newValue.FSYM}~${newValue.TSYM}`
      const sub = this.subs.find((e) => e.channelString === channelString)

      // sub이 없으면 리턴
      if (!sub) return
      // lastbar의 time보다 낮으면 리턴
      if (newValue.TS < sub.lastBar.time / 1000) return
      // 최산바 생성
      let _lastBar = this.updateBar(newValue, sub)
      // 최신 바 업데이트
      sub.listener(_lastBar)
      // sub의 lastbar 최신화
      sub.lastBar = _lastBar
    },
  },
  mounted() {
    this.createChart()
  },
  methods: {
    createChart() {
      const widgetOptions = {
        symbol: this.symbol,
        datafeed: this.dataFeed(),
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
    dataFeed() {
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

      const dataObj = {
        onReady: (cb) => {
          console.log('=====onReady running')
          setTimeout(() => cb(config), 0)
        },
        searchSymbols: (
          userInput,
          exchange,
          symbolType,
          onResultReadyCallback
        ) => {
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
            exchange: 'Binance',
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
          this.subscribeBars(
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
        getTimeScaleMarks: (
          symbolInfo,
          from,
          to,
          onDataCallback,
          resolution
        ) => {
          //optional
          console.log('=====getTimeScaleMarks running')
        },
        getServerTime: (cb) => {
          console.log('=====getServerTime running')
        },
      }
      return dataObj
    },
    subscribeBars(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      uid,
      onResetCacheNeededCallback
    ) {
      const channelString = this.createChannelString(symbolInfo)

      let newSub = {
        channelString,
        uid,
        resolution,
        symbolInfo,
        lastBar: historyProvider.history[symbolInfo.name].lastBar,
        listener: onRealtimeCallback,
      }
      this.subs.push(newSub)
    },
    updateBar(data, sub) {
      let lastBar = sub.lastBar
      let resolution = sub.resolution
      // 1 day in minutes === 1440
      // 1 week in minutes === 10080
      resolution.includes('D')
        ? (resolution = 1440)
        : resolution.includes('W')
        ? (resolution = 10080)
        : resolution

      var coeff = resolution * 60

      var rounded = Math.floor(data.TS / coeff) * coeff

      var lastBarSec = lastBar.time / 1000

      var _lastBar = {}
      // 새로운 캔들에 업데이트
      if (rounded > lastBarSec) {
        _lastBar = {
          time: rounded * 1000,
          open: lastBar.close,
          high: lastBar.close,
          low: lastBar.close,
          close: data.P,
          volume: data.TOTAL,
        }
        return _lastBar
      }
      // 마지막 캔들에  업데이트
      data.P < lastBar.low
        ? (lastBar.low = data.P)
        : data.P > lastBar.high
        ? (lastBar.high = data.P)
        : null

      lastBar.volume += data.Q
      lastBar.close = data.P
      _lastBar = lastBar

      return _lastBar
    },
    createChannelString(symbolInfo) {
      console.log(symbolInfo)
      var channel = symbolInfo.name.split(/[:/]/)
      const exchange = symbolInfo.exchange
      const to = channel[1]
      const from = channel[0]
      // subscribe to the CryptoCompare trade channel for the pair and exchange
      return `0~${exchange}~${from}~${to}`
    },
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
