<template>
  <div class="contentWrap">
    <div class="titleWrap">
      <span>Price({{ TSYM }})</span>
      <span>Amount({{ FSYM }})</span>
      <span>Time</span>
    </div>
    <div>
      <ul>
        <perfect-scrollbar>
          <template v-for="(arr, index) in c_reverse_trade_list">
            <li :key="index" class="listWrap">
              <div class="listItem">
                <span :class="[arr.F === '1' ? 'red' : 'green']" class="price">
                  {{ arr.P }}
                </span>
                <span>
                  {{ arr.Q }}
                </span>
                <span>{{ changeDateFormat(arr.TS) }}</span>
              </div>
            </li>
          </template>
        </perfect-scrollbar>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      trade_list: [],
    }
  },
  computed: {
    ...mapGetters('socket', ['displayTrade']),
    ...mapState('asset', ['FSYM']),
    ...mapState('asset', ['TSYM']),
    c_reverse_trade_list() {
      return this.trade_list.slice(0).reverse()
    },
  },
  watch: {
    displayTrade: {
      deep: true,
      handler(newValue) {
        if (this.trade_list.length > 20) this.trade_list.shift()

        let new_data = newValue[`${this.FSYM}/${this.TSYM}`]
        if (!new_data) return

        this.trade_list.push(new_data)
      },
    },
    FSYM() {
      this.trade_list = []
    },
  },
  methods: {
    changeDateFormat(val) {
      const milliseconds = val * 1000
      const date_object = new Date(milliseconds)
      const date_format = `${date_object.getHours()}:${date_object.getMinutes()}:${date_object.getSeconds()}`
      return date_format
    },
  },
}
</script>
