<template>
  <div :class="$style.coinListWrap" class="boxLine">
    <div :class="$style.searchWrap">
      <el-input placeholder="search" v-model="search_coin"></el-input>
    </div>
    <el-tabs type="card" v-model="activeName" @tab-click="tabClick">
      <el-tab-pane name="like">
        <span slot="label"><i class="el-icon-star el-icon-star-on"></i></span>
        <div :class="$style.tabContentWrap">
          <div v-if="!c_like_list.length">
            <p :class="$style.noLikeList">관심 목록이 없습니다.</p>
            <p :class="$style.noLikeList"
              >별 아이콘을 눌러서 관심 목록에 추가해주세요.</p
            >
          </div>
          <div v-else>
            <div :class="$style.titleWrap">
              <span>Pair</span>
              <span>Price</span>
              <span>Change</span>
            </div>
            <ul :class="$style.contentWrap">
              <perfect-scrollbar>
                <template v-for="(val, index) in c_like_list">
                  <li :class="$style.listWrap" :key="index">
                    <span>
                      <i
                        :class="[
                          { 'el-icon-star-on': val.like },
                          'el-icon-star',
                        ]"
                        @click="likeHandler(val)"
                      ></i>
                      {{ val.FROMSYMBOL }}/{{ TSYM }}
                    </span>
                    <span
                      @click="changeAsset(val.FROMSYMBOL, val.TOSYMBOL)"
                      :class="val.FLAGS === '1' ? $style.green : $style.red"
                    >
                      {{ calculatePrice(val.PRICE) }}
                    </span>
                    <span
                      :class="
                        calculateChangeDay(val.OPENDAY, val.PRICE) > 0
                          ? $style.green
                          : $style.red
                      "
                      >{{
                        calculateChangeDay(val.OPENDAY, val.PRICE) + '%'
                      }}</span
                    >
                  </li>
                </template>
              </perfect-scrollbar>
            </ul>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="BTC" name="BTC">
        <div :class="$style.tabContentWrap">
          <div :class="$style.titleWrap">
            <span>Pair</span>
            <span>Price</span>
            <span>Change</span>
          </div>
          <ul :class="$style.contentWrap">
            <perfect-scrollbar>
              <template v-for="(val, index) in c_search_filter_list">
                <li :class="$style.listWrap" :key="index">
                  <span>
                    <i
                      :class="[{ 'el-icon-star-on': val.like }, 'el-icon-star']"
                      @click="likeHandler(val)"
                    ></i>
                    {{ val.FROMSYMBOL }}/{{ TSYM }}
                  </span>
                  <span
                    @click="changeAsset(val.FROMSYMBOL, val.TOSYMBOL)"
                    :class="val.FLAGS === '1' ? $style.green : $style.red"
                  >
                    {{ calculatePrice(val.PRICE) }}
                  </span>
                  <span
                    :class="
                      calculateChangeDay(val.OPENDAY, val.PRICE) > 0
                        ? $style.green
                        : $style.red
                    "
                    >{{
                      calculateChangeDay(val.OPENDAY, val.PRICE) + '%'
                    }}</span
                  >
                </li>
              </template>
            </perfect-scrollbar>
          </ul>
        </div>
      </el-tab-pane>
      <el-tab-pane label="ETH" name="ETH">
        <div :class="$style.tabContentWrap">
          <div :class="$style.titleWrap">
            <span>Pair</span>
            <span>Price</span>
            <span>Change</span>
          </div>
          <ul :class="$style.contentWrap">
            <perfect-scrollbar>
              <template v-for="(val, index) in c_search_filter_list">
                <li :class="$style.listWrap" :key="index">
                  <span>
                    <i
                      :class="[{ 'el-icon-star-on': val.like }, 'el-icon-star']"
                      @click="likeHandler(val)"
                    ></i>
                    {{ val.FROMSYMBOL }}/{{ TSYM }}
                  </span>
                  <span
                    @click="changeAsset(val.FROMSYMBOL, val.TOSYMBOL)"
                    :class="val.FLAGS === '1' ? $style.green : $style.red"
                  >
                    {{ calculatePrice(val.PRICE) }}
                  </span>
                  <span
                    :class="
                      calculateChangeDay(val.OPENDAY, val.PRICE) > 0
                        ? $style.green
                        : $style.red
                    "
                    >{{
                      calculateChangeDay(val.OPENDAY, val.PRICE) + '%'
                    }}</span
                  >
                </li>
              </template>
            </perfect-scrollbar>
          </ul>
        </div>
      </el-tab-pane>
      <el-tab-pane label="USDT" name="USDT">Task</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { fetchSymbolsFullData } from '@/apis/cryptocompare'
import filter from 'lodash/filter'
import map from 'lodash/map'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import Decimal from 'decimal.js'

export default {
  data() {
    return {
      max: 1,
      coin_list: [],
      search_coin: '',
      activeName: 'BTC',
    }
  },
  computed: {
    ...mapState('asset', ['TSYM']),
    ...mapState('asset', ['FSYM']),
    ...mapState('asset', ['assets_full_data']),
    ...mapGetters('socket', ['displayTicker']),
    c_search_filter_list() {
      return filter(
        this.coin_list,
        (el) =>
          !this.search_coin ||
          el.FROMSYMBOL.toLowerCase().includes(
            this.search_coin.toLowerCase()
          ) ||
          el.TOSYMBOL.toLowerCase().includes(this.search_coin.toLowerCase())
      )
    },
    c_like_list() {
      return filter(this.coin_list, { like: true })
    },
  },
  watch: {
    displayTicker(newValue) {
      let find_asset = find(this.coin_list, {
        FROMSYMBOL: newValue.FROMSYMBOL,
      })
      if (find_asset === undefined) return
      if (!newValue.PRICE) return

      find_asset.PRICE = newValue.PRICE
      find_asset.FLAGS = newValue.FLAGS.toString()

      let find_asset_index = findIndex(this.coin_list, {
        FROMSYMBOL: newValue.FROMSYMBOL,
      })
      this.coin_list.splice(find_asset_index, 1, find_asset)
    },
  },
  methods: {
    changeAsset(FSYM, TSYM) {
      this.$store.commit('common/ON_LOADING')
      setTimeout(() => {
        this.$store.commit('common/OFF_LOADING')
      }, 2000)
      this.$store.dispatch('asset/updateSymbol', { FSYM, TSYM })
    },
    calculatePrice(price) {
      return new Decimal(price).toFixed(8)
    },
    calculateChangeDay(openDay, price) {
      return Decimal.sub(price, openDay).div(openDay).mul(100).toFixed(2)
    },
    likeHandler(obj) {
      let tlqkf = this.coin_list.findIndex((el) => el === obj)
      obj.like = !obj.like
      this.coin_list.splice(tlqkf, 1, obj)
    },
    tabClick() {
      if (this.activeName === 'like') return
      if (this.activeName === this.TSYM) return
      this.$store.dispatch('asset/updateSymbol', {
        FSYM: this.FSYM,
        TSYM: this.activeName,
      })
      this.$store.dispatch('asset/getSymbolsFullData')
    },
    Decimal,
  },
  mounted() {
    this.coin_list = this.assets_full_data
  },
}
</script>

<style lang="scss" module>
.tabContentWrap {
  min-height: 535px;

  .noLikeList {
    padding-top: 30px;
  }
}
.coinListWrap {
  .searchWrap {
    margin-bottom: 20px;
  }
  padding: 10px;
  margin-bottom: 20px;
  .titleWrap {
    display: flex;
    align-items: center;
    span {
      display: flex;
      flex: 1 1 0%;
      padding-left: 50px;
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
    span {
      display: flex;
      flex: 1 1 0%;
      // padding-left: 50px;
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
}
</style>
<style lang="scss">
.ps {
  height: 500px;
}
</style>
<style>
.el-icon-star {
  font-size: 18px;
  margin-right: 6px;
  color: #c0c4cc;
  transition: 0.3s;
}
.el-icon-star::before {
  content: '\e717';
}
.el-icon-star-on {
  color: rgb(247, 186, 42);
}
.el-icon-star-on::before {
  content: '\e797';
}
.el-icon-star:hover {
  color: rgb(247, 186, 42);
  transform: scale(1.15);
}
</style>
