<template>
  <el-container>
    <!-- <el-header>for portfolio</el-header> -->
    <el-container>
      <el-main><Main></Main></el-main>
      <el-footer> For Jang Jong-doo's portfolio </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import Main from '@/views/main.vue'

export default {
  name: 'Home',
  components: {
    Main,
  },
}
</script>
<style lang="scss" scoped>
.el-header,
.el-footer {
  background-color: #293335;
  color: #91abaa;
  text-align: center;
  line-height: 60px;
}
body > .el-container {
  margin-bottom: 40px;
  background: #f9f9f9;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
