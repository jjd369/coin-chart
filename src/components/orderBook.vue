<template>
  <div v-if="0" class="boxLine">
    <div :class="$style.orderBookWrap">
      <!-- bid -->
      <div :class="$style.rightBox">
        <div :class="[$style.title, $style.row]">
          <span>Amount</span>
          <span>Price</span>
        </div>
        <template v-for="(arr, index) in bid">
          <div :class="$style.row" :key="index">
            <span :class="$style.amount">{{ arr.Q }}</span>
            <span :class="$style.price">{{ arr.P }}</span>
          </div>
        </template>
      </div>
      <!-- ask -->
      <div :class="$style.leftBox">
        <div :class="[$style.title, $style.row]">
          <span>Price</span>
          <span>Amount</span>
        </div>
        <template v-for="(arr, index) in ask">
          <div :class="$style.row" :key="index">
            <span :class="$style.price">{{ arr.P }}</span>
            <span :class="$style.amount">{{ arr.Q }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrderBook } from '@/apis/cryptocompare'
import { mapState, mapGetters } from 'vuex'

// import find from 'lodash/find'
export default {
  data() {
    return {
      bid: null,
      ask: null,
      order_type: '',
    }
  },
  computed: {
    ...mapGetters('socket', ['displayOrderBook']),
    ...mapState('asset', ['FSYM']),
    ...mapState('asset', ['TSYM']),
  },
  watch: {
    displayOrderBook(val) {
      if (val.ACTION === 2) return
      val.SIDE === 0 ? this.updateBid(val) : this.updateAsk(val)
    },
  },
  methods: {
    async getOrderBook() {
      const { data } = await getOrderBook({
        fsym: this.FSYM,
        tsym: this.TSYM,
        e: 'Binance',
        limit: 15,
      })
      this.bid = data.Data.BID
      this.ask = data.Data.ASK
    },
    updateBid(data) {
      let add_bid = {
        P: data.P,
        Q: data.Q,
      }
      this.bid.push(data)
      this.bid.shift()
    },
    updateAsk(data) {
      let add_ask = {
        P: data.P,
        Q: data.Q,
      }
      this.ask.push(data)
      this.ask.shift()
    },
  },
  mounted() {
    Promise.all([this.getOrderBook()]).catch((e) => {
      console.log(e)
    })
  },
}
</script>

<style lang="scss" module>
.orderBookWrap {
  display: flex;
  .rightBox {
    padding: 10px;
    flex: 1 1 40%;
    .price {
      color: #0ecb81;
    }
  }
  .leftBox {
    padding: 10px;
    flex: 1 1 40%;
    .price {
      color: #f6465d;
    }
  }
  .row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
  }
}
</style>
