<template>
  <div class="boxLine" :class="$style.tradeWrap">
    <div :class="$style.titleWrap">
      <span>Price({{ TSYM }})</span>
      <span>Amount({{ FSYM }})</span>
      <span>Time</span>
    </div>
    <div>
      <ul :class="$style.contentWrap">
        <perfect-scrollbar :class="$style.ps">
          <template v-for="(arr, index) in c_reverse_trade_list">
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
    c_reverse_trade_list() {
      return this.trade_list.slice(0).reverse()
    },
  },
  watch: {
    displayTrade: {
      deep: true,
      handler(newValue) {
        if (this.trade_list.length > 20) this.trade_list.shift()

        let new_data = newValue[`${this.FSYM}/${this.TSYM}`]
        if (!new_data) return

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
.tradeWrap {
  min-height: 235px;
  padding: 10px;
  .ps {
    height: 338px;
  }
}
.titleWrap {
  display: flex;
  align-items: center;
  padding: 10px;
  span {
    display: flex;
    &:nth-child(1) {
      flex: 5 1 0px;
      justify-content: flex-start;
      min-width: 120px;
    }
    &:nth-child(2) {
      flex: 3 1 0px;
      justify-content: flex-end;
      min-width: 50px;
    }
    &:nth-child(3) {
      flex: 3 1 0px;
      justify-content: flex-end;
      min-width: 60px;
    }
  }
}
.listWrap {
  display: flex;
  align-items: center;
  padding: 0 5px 15px 5px;

  &:hover {
    cursor: pointer;
  }
  .price {
    font-weight: 600;
  }
  span {
    display: flex;
    &:nth-child(1) {
      flex: 5 1 0px;
      justify-content: flex-start;
      min-width: 120px;
    }
    &:nth-child(2) {
      flex: 3 1 0px;
      justify-content: flex-end;
      min-width: 50px;
    }
    &:nth-child(3) {
      flex: 3 1 0px;
      justify-content: flex-end;
      min-width: 60px;
    }
  }
  .green {
    color: $green;
  }
  .red {
    color: $red;
  }
}
</style>
