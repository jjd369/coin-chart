<template>
  <el-container>
    <el-header>Site created based on Binance trading information </el-header>
    <el-main><Main></Main></el-main>
    <el-footer> For Jang Jong-doo's portfolio </el-footer>
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
