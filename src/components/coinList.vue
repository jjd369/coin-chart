<template>
  <div>
    <div> </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import filter from 'lodash/filter'
import includes from 'lodash/includes'

export default {
  data() {
    return {}
  },
  mounted() {},
  computed: {
    ...mapState(['coin_list', 'TSYM']),

    c_coin_list() {
      return this.test()
    },
  },
  // mounted() {
  //   Promise.all([this.getCoinList()]).catch((e) => {
  //     console.log(e)
  //   })
  // },
  methods: {
    test() {
      return filter(this.coin_list, (el) => {
        console.log(el)
        return el.tsyms
      })
    },
  },
}
</script>

<style lang="scss" moudle></style>
