<template>
  <div class="boxLine">
    <div :class="$style.titleWrap">
      <span>Price()</span>
      <span>Amount()</span>
      <span>Time</span>
    </div>
    <div>
      <ul :class="$style.contentWrap">
        <perfect-scrollbar>
          <template v-for="(arr, index) in trade_list">
            <li :key="index" :class="$style.listWrap">
              <span
                :class="[arr.F === '1' ? $style.red : $style.green]"
                class="price"
              >
                {{ arr.P }}
              </span>
              <span>
                {{ arr.Q }}
              </span>
              <span>{{ changeDateFormat(arr.TS) }}</span>
            </li>
          </template>
        </perfect-scrollbar>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      trade_list: [],
    }
  },
  computed: {
    ...mapGetters('socket', ['displayTrade']),
    ...mapState('asset', ['FSYM']),
    ...mapState('asset', ['TSYM']),
  },
  watch: {
    displayTrade: {
      deep: true,
      handler(newValue) {
        if (this.trade_list.length > 20) this.trade_list.shift()

        let new_data = newValue[`${this.FSYM}/${this.TSYM}`]
        if (!new_data) return

        if (`${this.FSYM}/${this.TSYM}` !== `${new_data.FSYM}/${new_data.TSYM}`)
          return
        this.trade_list.push(new_data)
      },
    },
    FSYM() {
      this.trade_list = []
    },
  },
  methods: {
    changeDateFormat(val) {
      const milliseconds = val * 1000
      const date_object = new Date(milliseconds)
      const date_format = `${date_object.getHours()}:${date_object.getMinutes()}:${date_object.getSeconds()}`
      return date_format
    },
  },
}
</script>

<style lang="scss" module>
.titleWrap {
  display: flex;
  align-items: center;
  span {
    display: flex;
    flex: 1 1 0%;
    padding-left: 1em;
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
.listWrap {
  display: flex;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
  .price {
    font-weight: 600;
  }
  span {
    display: flex;
    flex: 1 1 0%;
    padding-left: 1em;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .green {
    color: #0ecb81;
  }
  .red {
    color: #f6465d;
  }
}
</style>
