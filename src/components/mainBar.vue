<template>
  <div>
    <div
      ><span>{{ FSYM }} / {{ TSYM }}</span></div
    >
    <div>
      {{ displayTicker.P }}
    </div>
    <div></div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      coin_info: {},
    }
  },
  computed: {
    ...mapState('asset', ['FSYM']),
    ...mapState('asset', ['TSYM']),
    ...mapGetters('socket', ['displayTicker']),
  },
  methods: {
    fliter_ticker(val) {},
  },
}
</script>

<style></style>
