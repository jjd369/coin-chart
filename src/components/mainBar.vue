<template>
  <div>
    <div
      ><span>{{ FSYM }} / {{ TSYM }}</span>
      <span>{{ displayTrade.P }}</span>
    </div>
    <div>
      <div>
        <span>24h Change </span>
        <span></span>
      </div>
      <div><span>24h High </span> <span></span></div>
      <div><span>24h Low </span> <span></span></div>
      <div
        ><span>24h Volume({{ FSYM }}) </span>
        <span>{{ coin_info.VOLUME24HOUR }}</span></div
      >
      <div
        ><span>24h Volume({{ TSYM }}) </span>
        <span>{{ coin_info.VOLUME24HOURTO }}</span></div
      >
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      coin_info: {},
    }
  },
  computed: {
    ...mapState('asset', ['FSYM']),
    ...mapState('asset', ['TSYM']),
    ...mapGetters('socket', ['displayTicker']),
    ...mapGetters('socket', ['displayTrade']),
  },
  watch: {
    displayTicker(val) {
      if (val.FROMSYMBOL !== this.FSYM) return
      if (val.TOSYMBOL !== this.TSYM) return

      this.coin_info = val
    },
  },
  methods: {
    fliter_ticker(val) {},
  },
}
</script>

<style></style>
