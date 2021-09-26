<template>
  <div>
    <el-row :gutter="40">
      <el-col :span="18"
        ><div>
          <mainBar></mainBar>
          <TVChartContainer></TVChartContainer>
        </div>
        <div><orderBook></orderBook></div
      ></el-col>
      <el-col :span="6"
        ><div> <coinList></coinList> <marketTrade></marketTrade></div
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import TVChartContainer from '@/components/TVChartContainer.vue'
import orderBook from '@/components/orderBook.vue'
import coinList from '@/components/coinList.vue'
import marketTrade from '@/components/marketTrade.vue'
import mainBar from '@/components/mainBar.vue'

export default {
  components: {
    TVChartContainer,
    orderBook,
    coinList,
    marketTrade,
    mainBar,
  },
  data() {
    return {}
  },
  methods: {},
}
</script>

<style></style>
