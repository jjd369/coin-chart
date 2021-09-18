<template>
  <div>
    <div>
      <div>
        <span>Pair</span>
        <span>Price</span>
        <span>Change</span>
      </div>
      <ul>
        <template v-for="(val, key, index) in symbols_full_data">
          <li :key="index" @click="changeAsset(val)">
            <span>
              <!-- <el-rate max="1" v-model="like"></el-rate> -->
              {{ key }}/{{ TSYM }}
            </span>
            <span> {{}} </span>
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
    }
  },
  computed: {
    ...mapState('asset', ['TSYM']),
    ...mapState('asset', ['FSYMS']),
    ...mapState('asset', ['symbols_full_data']),
  },
  mounted() {
    console.log(this.symbols_full_data)
  },
  methods: {
    changeAsset(val) {
      console.log(val)
    },
  },
}
</script>

<style lang="scss" moudle></style>
