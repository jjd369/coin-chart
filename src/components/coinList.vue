<template>
  <div>
    <div>
      <div>
        <span>Pair</span>
        <span>Price</span>
        <span>Change</span>
      </div>
      <ul>
        <template v-for="(val, index) in c_coin_list">
          <li :key="index">
            <span>
              <!-- <el-rate max="1" v-model="like"></el-rate> -->
              {{ val.title }}/{{ TSYM }}
            </span>
            <span> </span>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import filter from 'lodash/filter'

export default {
  data() {
    return {
      like: null,
    }
  },
  computed: {
    ...mapState(['socket', 'coin_list', 'TSYM']),
    c_coin_list() {
      return this.coinFilter()
    },
  },
  mounted() {
    // this.socket.onmessage = (event) => {
    //   let data = JSON.parse(event.data)
    //   console.log(data)
    // }
  },
  methods: {
    coinFilter() {
      return filter(this.coin_list, (el) => {
        return el.tsyms.includes(this.TSYM)
      })
    },
  },
}
</script>

<style lang="scss" moudle></style>
