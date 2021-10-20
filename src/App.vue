<template>
  <div id="app" v-loading="loading">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view />
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('common', ['loading']),
  },
  mounted() {
    setTimeout(() => {
      this.$store.commit('common/OFF_LOADING')
    }, 3000)
  },
}
</script>
<style lang="scss"></style>
