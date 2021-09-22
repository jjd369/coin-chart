<template>
  <div>
    <div>
      <div :class="$style.titleWrap">
        <span>Pair</span>
        <span>Price</span>
        <span>Change</span>
      </div>
      <ul>
        <template v-for="(val, index) in c_coin_list">
          <li
            :class="$style.contentWrap"
            :key="index"
            @click="changeAsset(val)"
          >
            <span>
              <!-- <el-rate max="1" v-model="like"></el-rate> -->
              {{ val.FROMSYMBOL }}/{{ TSYM }}
            </span>
            <span> {{ calculatePrice(val.PRICE) }} </span>
            <span>{{ calculateChangeDay(val.OPENDAY, val.PRICE) + '%' }}</span>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { fetchSymbolsFullData } from '@/apis/cryptocompare'
import filter from 'lodash/filter'
import map from 'lodash/map'
import Decimal from 'decimal.js'

export default {
  data() {
    return {
      like: null,
    }
  },
  computed: {
    ...mapState('asset', ['TSYM']),
    ...mapState('asset', ['FSYMS']),
    ...mapState('asset', ['symbols_full_data']),
    c_coin_list() {
      return map(this.symbols_full_data, (el) => {
        return {
          FROMSYMBOL: el.FROMSYMBOL,
          TOSYMBOL: el.TOSYMBOL,
          PRICE: el.PRICE,
          VOLUMEDAY: el.VOLUMEDAY,
          OPENDAY: el.OPENDAY,
        }
      })
    },
  },
  mounted() {},
  methods: {
    Decimal,
    changeAsset(val) {
      console.log(val)
    },
    calculatePrice(price) {
      return new Decimal(price).toFixed(8)
    },
    calculateChangeDay(openDay, price) {
      return Decimal.sub(price, openDay).div(openDay).mul(100).toFixed(2)
    },
  },
}
</script>

<style lang="scss" module>
.titleWrap {
  display: flex;
  align-items: center;
  span {
    display: flex;
    flex: 1 1 0%;
  }
}
.contentWrap {
  display: flex;
  align-items: center;
  span {
    display: flex;
    flex: 1 1 0%;
  }
}
</style>
