<template>
  <el-container>
    <el-header><Header></Header></el-header>
    <el-container>
      <el-container>
        <el-main><Main></Main></el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/header.vue'
import Main from '@/views/main.vue'

export default {
  name: 'Home',
  components: {
    Header,
    Main,
  },
  mounted() {},
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

// .el-main {
//   background-color: #e9eef3;
//   color: #333;
//   text-align: center;
//   line-height: 160px;
// }

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
