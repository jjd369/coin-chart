<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-main></el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
// import Header from "@/components/header.vue";
// import TVChartContainer from "@/components/TVChartContainer.vue";
import { OHLCV } from '@/apis/cryptocompare'
export default {
  name: 'Home',
  components: {
    // TVChartContainer,
    // Header,
  },
  mounted() {
    return OHLCV(
      {
        fsym: 'BTC',
        tsym: 'USD',
        limit: 10,
      },
      'histoday'
    )
      .then(({ data }) => {
        const { Data } = data
        console.log(Data)
      })
      .catch((e) => {
        console.log(e)
      })
  },
}
</script>
<style lang="scss" scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
