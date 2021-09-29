<template>
  <div class="boxLine">
    <div class="TVChartContainer" :id="container_id" />
  </div>
</template>

<script>
import { widget } from '../../public/charting_library'
import { mapState, mapGetters, mapActions } from 'vuex'
import { OHLCV } from '@/apis/cryptocompare'

export default {
  name: 'TVChartContainer',
  tvWidget: null,
  data() {
    return {
      interval: '1D',
      container_id: 'tv_chart_container',
      library_path: '/charting_library/',
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      fullscreen: false,
      autosize: true,
      studies_overrides: null,
      last_bar: null,
      first_bar: null,
      resolution: '',
      onRealtimeCallback: () => {},
      get_bar_list: [],
    }
  },
  computed: {
    ...mapGetters('socket', ['displayTrade']),
    ...mapState('asset', ['FSYM']),
    ...mapState('asset', ['TSYM']),
  },
  watch: {
    displayTrade(newValue) {
      if (newValue.FSYM !== this.FSYM && newValue.TSYM !== this.TSYM) return
      // 최산바 생성
      let _lastBar = this.updateBar(newValue)
      // 최신 바 업데이트
      this.onRealtimeCallback(_lastBar)
    },
    FSYM() {
      this.tvWidget.setSymbol(`${this.FSYM}/${this.TSYM}`, this.interval)
      this.get_bar_list = []
    },
  },
  methods: {
    ...mapActions('socket', ['addChannelString']),
    ...mapActions('socket', ['deleteChannelString']),

    //create chart
    createChart() {
      const widgetOptions = {
        symbol: `${this.FSYM}/${this.TSYM}`,
        datafeed: this.dataFeed(),
        interval: this.interval,
        container: this.container_id,
        library_path: this.library_path,
        locale: 'ko',
        disabled_features: [
          'use_localstorage_for_settings',
          'volume_force_overlay',
          'create_volume_indicator_by_default',
          'timeframes_toolbar',
          'header_compare',
        ],
        clientId: this.client_id,
        userId: this.user_id,
        fullscreen: this.fullscreen,
        autosize: this.autosize,
        studies_overrides: this.studies_overrides,
      }
      const tvWidget = new widget(widgetOptions)
      this.tvWidget = tvWidget
    },
    // return js object for data feed
    dataFeed() {
      const supportedResolutions = ['1D', '1W', '1M']

      const config = {
        supported_resolutions: supportedResolutions,
      }

      const dataObj = {
        onReady: (callback) => {
          console.log('=====onReady running')
          setTimeout(() => callback(config), 0)
        },
        searchSymbols: async (
          userInput,
          exchange,
          symbolType,
          onResultReadyCallback
        ) => {
          console.log('====Search Symbols running')
        },
        resolveSymbol: async (
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
        getBars: async (
          symbolInfo,
          resolution,
          periodParams,
          onHistoryCallback,
          onErrorCallback
        ) => {
          console.log('=====getBars running')
          await this.getHistoryData(symbolInfo, resolution, periodParams)
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
          this.unsubscribeBars(subscriberUID)
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
    // get historical data
    async getHistoryData(symbolInfo, resolution, periodParams) {
      if (this.get_bar_list.includes(symbolInfo.name)) return []
      this.resolution = resolution
      this.get_bar_list.push(symbolInfo.name)
      const { firstDataRequest, to, countBack } = periodParams
      var split_symbol = symbolInfo.name.split(/[:/]/)
      const params = {
        fsym: split_symbol[0],
        tsym: split_symbol[1],
        // toTs: to,
        // limit: 2000,
        allData: true,
        e: 'Binance',
      }
      const { data } = await OHLCV(params, 'histoday')
      const his_data = data.Data.Data

      if (!his_data.length) return []
      let bar_fliter = his_data.filter((el) => el.volumefrom !== 0)
      let bars = his_data.map((el) => {
        return {
          time: el.time * 1000, //TradingView requires bar time in ms
          low: el.low,
          high: el.high,
          open: el.open,
          close: el.close,
          volume: el.volumefrom,
        }
      })
      if (firstDataRequest) {
        this.first_bar = bars[0]
        this.last_bar = bars[bars.length - 1]
      }
      return bars
    },
    //
    async subscribeBars(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      uid,
      onResetCacheNeededCallback
    ) {
      this.onRealtimeCallback = onRealtimeCallback
      let symbol_array = symbolInfo.name.split('/')

      let sub_item = {
        type: 0,
        fsym: symbol_array[0],
        tsym: symbol_array[1],
      }
      this.addChannelString(sub_item)
    },
    unsubscribeBars(subscriberUID) {
      // let UID_array = subscriberUID.slice(0, -5).split('/')
      // let unsub_item = {
      //   type: 0,
      //   fsym: UID_array[0],
      //   tsym: UID_array[1],
      // }
      // this.deleteChannelString(unsub_item)
    },
    updateBar(data) {
      let lastBar = this.last_bar
      let resolution = this.resolution
      // 1 day in minutes === 1440
      // 1 week in minutes === 10080
      resolution.includes('1D')
        ? (resolution = 1440)
        : resolution.includes('1W')
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
      } else {
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
      }
    },
    destroyed() {
      if (this.tvWidget !== null) {
        this.tvWidget.remove()
        this.tvWidget = null
      }
    },
  },
  mounted() {
    // chart init
    this.createChart()
  },
}
</script>
<style lang="scss" scoped>
.TVChartContainer {
  height: 1000px;
}
</style>
