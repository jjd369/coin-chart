<template>
<div>
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
