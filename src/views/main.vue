<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="Chart" name="first"
      ><TVChartContainer></TVChartContainer
    ></el-tab-pane>
    <el-tab-pane label="Order Book" name="second"
      ><orderBook></orderBook
    ></el-tab-pane>
    <el-tab-pane label="Trades" name="third">Role</el-tab-pane>
  </el-tabs>
</template>

<script>
import TVChartContainer from '@/components/TVChartContainer.vue'
import orderBook from '@/components/orderBook.vue'

export default {
  components: {
    TVChartContainer,
    orderBook,
  },
  data() {
    return {
      activeName: 'first',
      test: false,
      subs: '',
    }
  },
  methods: {
    handleClick(tab) {
      console.log(tab)
      // switch (tab.label) {
      //   case 'Chart':
      //     this.subs = '0~Coinbase~BTC~USD'
      //     break
      //   case 'Order Book':
      //     this.subs = '30~Coinbase~BTC~USD'
      //     break
      //   case 'Trades':
      //     this.subs = '0~Coinbase~BTC~USD'
      //     break
      // }
      // this.$store.dispatch('sendMessage', {
      //   action: 'SubAdd',
      //   subs: [this.subs],
      // })
    },
  },
}
</script>

<style></style>
