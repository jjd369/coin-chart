<template>
  <div>
    <div>
      <div :class="$style.titleWrap">
        <span>Pair</span>
        <span>Price</span>
        <span>Change</span>
      </div>
      <ul>
        <template v-for="(val, key, index) in symbols_full_data">
          <li
            :class="$style.contentWrap"
            :key="index"
            @click="changeAsset(val)"
          >
            <span>
              <!-- <el-rate max="1" v-model="like"></el-rate> -->
              {{ key }}/{{ TSYM }}
            </span>
            <span> {{ val[`${TSYM}`].PRICE }} </span>
            <span>{{ val[`${TSYM}`].CHANGEDAY }}</span>
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

export default {
  data() {
    return {
      like: null,
      coin_list_array: [],
    }
  },
  computed: {
    ...mapState('asset', ['TSYM']),
    ...mapState('asset', ['FSYMS']),
    ...mapState('asset', ['symbols_full_data']),
    c_coin_array() {
      for (const key in this.symbols_full_data) {
        console.log(key)
      }
      return null
    },
  },
  mounted() {
    for (const key in this.symbols_full_data) {
      console.log(this.symbols_full_data[key][`${this.TSYM}`])
      this.coin_list_array.push(this.symbols_full_data[key][`${this.TSYM}`])
    }
  },
  methods: {
    changeAsset(val) {
      console.log(val)
    },
  },
}
</script>

<style lang="scss" module>
.titleWrap {
  display: flex;
  align-items: center;
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
