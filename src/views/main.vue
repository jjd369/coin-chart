<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="User" name="first"
      ><TVChartContainer></TVChartContainer
    ></el-tab-pane>
    <el-tab-pane label="Config" name="second"></el-tab-pane>
    <el-tab-pane label="Role" name="third"><coinList></coinList></el-tab-pane>
    <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
  </el-tabs>
</template>

<script>
import TVChartContainer from '@/components/TVChartContainer.vue'
import coinList from '@/components/coinList.vue'

export default {
  components: {
    TVChartContainer,
    coinList,
  },
  data() {
    return {
      activeName: 'first',
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
  },
}
</script>

<style></style>
