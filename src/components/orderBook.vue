<template>
  <div>
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
import { mapState } from 'vuex'
// import find from 'lodash/find'
export default {
  name: 'coinList',
  data() {
    return {
      bid: null,
      ask: null,
      order_type: '',
    }
  },
  watch: {
    // bid() {
    //   console.log(this.bid.length)
    //   if (this.bid.length > 31) {
    //     console.log('bid')
    //     this.bid.length = 30
    //   }
    // },
  },
  computed: {
    ...mapState(['socket']),
  },
  mounted() {
    console.log('orderbook mounted')
    Promise.all([this.getOrderBook()])
      .then(this.socketOnMessage)
      .catch((e) => {
        console.log(e)
      })
  },
  methods: {
    async getOrderBook() {
      const { data } = await getOrderBook()
      this.bid = data.Data.BID
      this.ask = data.Data.ASK
    },
    socketOnMessage() {
      this.socket.onmessage = (event) => {
        let data = JSON.parse(event.data)
        if (data.TYPE !== '30') return

        Object.keys(data).includes('BID')
          ? this.filter_BID(data)
          : this.filter_ASK(data)
      }
    },
    filter_BID(data) {
      const { BID } = data
      this.bid.push(BID[0])
      this.bid.shift()
    },
    filter_ASK(data) {
      const { ASK } = data
      this.ask.push(ASK[0])
      this.ask.shift()
    },
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
