<template>
  <div>
    <div :class="$style.mainBarWrap" class="boxLine">
      <div :class="$style.row">
        <div :class="$style.col">
          <span>{{ FSYM }} / {{ TSYM }}</span>
          <span :class="trade.FLAGS === '1' ? $style.green : $style.red">{{
            trade.P
          }}</span>
        </div>
      </div>
      <div :class="$style.row">
        <div :class="$style.col">
          <span>Change </span>
          <span
            :class="
              calculateChangeDay(c_openDay, trade.P) > 0
                ? $style.green
                : $style.red
            "
            >{{ calculateChangeDay(c_openDay, trade.P) }}%</span
          >
        </div>
        <div :class="$style.col"
          ><span>24h High </span> <span>{{ c_compare_high }}</span></div
        >
        <div :class="$style.col"
          ><span>24h Low </span> <span>{{ c_compare_low }}</span></div
        >
        <div :class="$style.col"
          ><span>24h Volume({{ FSYM }}) </span>
          <span>{{ coin_info.VOLUME24HOUR }}</span></div
        >
        <div :class="$style.col"
          ><span>24h Volume({{ TSYM }}) </span>
          <span>{{ coin_info.VOLUME24HOURTO }}</span></div
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import find from 'lodash/find'
import Decimal from 'decimal.js'

export default {
  data() {
    return {
      openDay: '',
      coin_info: null,
      high: '',
      low: '',
      trade: null,
      loading: false,
    }
  },
  computed: {
    ...mapState('asset', ['FSYM']),
    ...mapState('asset', ['TSYM']),
    ...mapState('asset', ['assets_full_data']),
    ...mapGetters('socket', ['displayTicker']),
    ...mapGetters('socket', ['displayTrade']),
    c_find_data() {
      return find(this.assets_full_data, {
        FROMSYMBOL: this.FSYM,
        TOSYMBOL: this.TSYM,
      })
    },
    c_high() {
      return this.c_find_data.HIGH24HOUR
    },
    c_low() {
      return this.c_find_data.LOW24HOUR
    },
    c_compare_high() {
      return Math.max(this.c_high, this.trade.P)
    },
    c_compare_low() {
      return Math.max(this.c_low, this.trade.P)
    },
    c_openDay() {
      return this.c_find_data.OPENDAY
    },
  },
  watch: {
    displayTicker(val) {
      if (val.FROMSYMBOL !== this.FSYM) return
      if (val.TOSYMBOL !== this.TSYM) return

      this.coin_info = val
    },
    displayTrade: {
      deep: true,
      handler(newValue) {
        let new_data = newValue[`${this.FSYM}/${this.TSYM}`]
        if (!new_data) return
        if (`${this.FSYM}/${this.TSYM}` !== `${new_data.FSYM}/${new_data.TSYM}`)
          return

        this.trade = new_data
      },
    },
    FSYM() {},
  },
  methods: {
    calculateChangeDay(openDay, price) {
      return Decimal.sub(price, openDay).div(openDay).mul(100).toFixed(2)
    },
    Decimal,
  },
}
</script>

<style lang="scss" module>
.mainBarWrap {
  display: flex;
  padding: 10px;
  margin-bottom: 20px;
  .row {
    display: flex;
    .col {
      display: flex;
      flex-direction: column;
      padding: 0 30px;
      span {
        &:first-child {
          padding-bottom: 10px;
        }
      }
      .green {
        color: #0ecb81;
      }
      .red {
        color: #f6465d;
      }
    }
  }
}
</style>
