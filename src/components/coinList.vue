<template>
  <div :class="$style.coinListWrap" class="boxLine">
    <div :class="$style.titleWrap">
      <span>Pair</span>
      <span>Price</span>
      <span>Change</span>
    </div>
    <ul :class="$style.contentWrap">
      <perfect-scrollbar>
        <template v-for="(val, index) in coin_list">
          <li
            :class="$style.listWrap"
            :key="index"
            @click="changeAsset(val.FROMSYMBOL, val.TOSYMBOL)"
          >
            <span>
              <!-- <el-rate max="1" v-model="like"></el-rate> -->
              {{ val.FROMSYMBOL }}/{{ TSYM }}
            </span>
            <span :class="val.FLAGS === '1' ? $style.green : $style.red">
              {{ calculatePrice(val.PRICE) }}
            </span>
            <span
              :class="
                calculateChangeDay(val.OPENDAY, val.PRICE) > 0
                  ? $style.green
                  : $style.red
              "
              >{{ calculateChangeDay(val.OPENDAY, val.PRICE) + '%' }}</span
            >
          </li>
        </template>
      </perfect-scrollbar>
    </ul>
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
      coin_list: [],
    }
  },
  computed: {
    ...mapState('asset', ['TSYM']),
    ...mapState('asset', ['FSYMS']),
    ...mapState('asset', ['assets_full_data']),
    ...mapGetters('socket', ['displayTicker']),
  },
  watch: {
    displayTicker(newVal) {
      let find_asset = find(this.coin_list, {
        FROMSYMBOL: newVal.FROMSYMBOL,
      })
      if (find_asset === undefined) return
      if (!newVal.PRICE) return

      find_asset.PRICE = newVal.PRICE
      find_asset.FLAGS = newVal.FLAGS.toString()

      let find_asset_index = findIndex(this.coin_list, {
        FROMSYMBOL: newVal.FROMSYMBOL,
      })
      this.coin_list.splice(find_asset_index, 1, find_asset)
    },
  },
  methods: {
    changeAsset(FSYM, TSYM) {
      this.$store.dispatch('asset/updateSymbol', { FSYM: FSYM, TSYM: TSYM })
    },
    calculatePrice(price) {
      return new Decimal(price).toFixed(8)
    },
    calculateChangeDay(openDay, price) {
      return Decimal.sub(price, openDay).div(openDay).mul(100).toFixed(2)
    },
    Decimal,
  },
  mounted() {
    this.coin_list = this.assets_full_data
  },
}
</script>

<style lang="scss" module>
.coinListWrap {
  margin-bottom: 30px;
  .titleWrap {
    display: flex;
    align-items: center;
    span {
      display: flex;
      flex: 1 1 0%;
      padding-left: 1em;
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
  .listWrap {
    display: flex;
    align-items: center;
    &:hover {
      cursor: pointer;
    }
    span {
      display: flex;
      flex: 1 1 0%;
      padding-left: 1em;
      padding-top: 10px;
      padding-bottom: 10px;
    }
    .green {
      color: #0ecb81;
    }
    .red {
      color: #f6465d;
    }
  }
}
</style>
<style lang="scss">
.ps {
  height: 500px;
}
</style>
