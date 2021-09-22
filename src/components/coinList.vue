<template>
  <div>
    <div>
      <div :class="$style.titleWrap">
        <span>Pair</span>
        <span>Price</span>
        <span>Change</span>
      </div>
      <ul>
        <template v-for="(val, index) in test">
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
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import Decimal from 'decimal.js'

export default {
  data() {
    return {
      like: null,
      test: [],
    }
  },
  computed: {
    ...mapState('asset', ['TSYM']),
    ...mapState('asset', ['FSYMS']),
    ...mapState('asset', ['assets_full_data']),
    ...mapGetters('socket', ['displayTicker']),
    c_coin_list() {
      return map(this.assets_full_data, (el) => {
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
  watch: {
    displayTicker(newVal) {
      let assets_list_index = findIndex(this.test, {
        FROMSYMBOL: newVal.FROMSYMBOL,
      })
      if (assets_list_index) {
        this.test.splice(assets_list_index, 1, newVal)
      }
      // console.log(find(this.c_coin_list, { FROMSYMBOL: newVal.FROMSYMBOL }))
    },
  },
  mounted() {
    this.test = this.assets_full_data
  },
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
