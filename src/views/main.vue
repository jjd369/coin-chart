<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="16"
        ><div>
          <TVChartContainer></TVChartContainer>
        </div>
        <div><orderBook></orderBook></div
      ></el-col>
      <el-col :span="8"
        ><div> <coinList></coinList></div
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import TVChartContainer from '@/components/TVChartContainer.vue'
import orderBook from '@/components/orderBook.vue'
import coinList from '@/components/coinList.vue'

export default {
  components: {
    TVChartContainer,
    orderBook,
    coinList,
  },
  data() {
    return {}
  },
  methods: {},
}
</script>

<style></style>
