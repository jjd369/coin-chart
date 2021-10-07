<template>
  <div>
    <div :class="$style.mainBarWrap" class="boxLine">
      <div :class="$style.row">
        <div :class="$style.col">
          <span>{{ FSYM }} / {{ TSYM }}</span>
          <span :class="[trade.FLAGS === '1' ? $style.green : $style.red]">{{
            trade.P
          }}</span>
        </div>
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
      coin_info: {},
      trade: {},
    }
  },
  computed: {
    ...mapState('asset', ['FSYM']),
    ...mapState('asset', ['TSYM']),
    ...mapState('asset', ['assets_full_data']),
    ...mapGetters('socket', ['displayTicker']),
    ...mapGetters('socket', ['displayTrade']),
    c_find_data() {
      return (
        find(this.assets_full_data, {
          FROMSYMBOL: this.FSYM,
          TOSYMBOL: this.TSYM,
        }) || {}
      )
    },
    c_compare_high() {
      return Math.max(this.c_find_data.HIGH24HOUR, this.trade.P)
    },
    c_compare_low() {
      return Math.max(this.c_find_data.LOW24HOUR, this.trade.P)
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

        this.trade = new_data
      },
    },
  },
  mounted() {
    console.log(this.assets_full_data)
  },
  methods: {
    calculateChangeDay(openDay, price) {
      if (!openDay || !price) return
      return Decimal.sub(price, openDay).div(openDay).mul(100).toFixed(2)
    },
    Decimal,
  },
}
</script>

<style lang="scss" module>
.mainBarWrap {
  display: flex;
  padding: 15px;
  margin-bottom: 20px;
  .row {
    display: flex;
    .col {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      flex: 1 1 0;
      padding-right: 50px;
      min-width: 100px;
      &:nth-child(n + 5) {
        min-width: 150px;
      }
      .green {
        color: $green;
      }
      .red {
        color: $red;
      }
    }
  }
}
</style>
