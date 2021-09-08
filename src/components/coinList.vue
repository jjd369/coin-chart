<template>
  <div>
    <ul :class="$style.header">
      <li> <span>Price(USDT)</span><span>Total</span><span>Total</span></li>
    </ul>
    <ul :class="$style.body">
      <li
        ><span>Price(USDT)</span><span>Amount(BTC)</span><span>Total</span></li
      >
    </ul>
  </div>
</template>

<script>
import { getOrderBook } from '@/apis/cryptocompare'
export default {
  name: 'coinList',
  data() {
    return {
      bid: null,
      ask: null,
    }
  },
  mounted() {
    this.getOrderBook()
  },
  methods: {
    async getOrderBook() {
      const { data } = await getOrderBook().catch((e) => {
        console.log(e)
      })

      this.bid = data.Data.BID
      this.ask = data.Data.ASK
    },
  },
}
</script>

<style lang="scss" module>
.header {
  background: #aaa;
}
.body {
  background: #eee;
}
</style>
