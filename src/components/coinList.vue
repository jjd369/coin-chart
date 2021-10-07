<template>
  <div :class="$style.coinListWrap" class="boxLine">
    <div :class="$style.searchWrap">
      <el-input placeholder="search" v-model="search_coin"></el-input>
    </div>
    <el-tabs type="card" v-model="activeName" @tab-click="tabClick">
      <!-- 관심 목록 -->
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
              <perfect-scrollbar :class="$style.ps">
                <template v-for="(val, index) in c_like_list">
                  <li :class="$style.listWrap" :key="index">
                    <div>
                      <i
                        :class="[
                          { 'el-icon-star-on': val.like },
                          'el-icon-star',
                        ]"
                        @click="favoritHandler(val)"
                      ></i>
                    </div>
                    <div
                      :class="$style.listItem"
                      @click="changeAsset(val.FROMSYMBOL, val.TOSYMBOL)"
                    >
                      <span> {{ val.FROMSYMBOL }}/{{ val.TOSYMBOL }} </span>
                      <span
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
                    </div>
                  </li>
                </template>
              </perfect-scrollbar>
            </ul>
          </div>
        </div>
      </el-tab-pane>
      <!-- BTC -->
      <el-tab-pane label="BTC" name="BTC">
        <div :class="$style.tabContentWrap">
          <div :class="$style.titleWrap">
            <span>Pair</span>
            <span>Price</span>
            <span>Change</span>
          </div>
          <ul :class="$style.contentWrap">
            <perfect-scrollbar :class="$style.ps">
              <template v-for="(val, index) in c_filter_search_list">
                <li :class="$style.listWrap" :key="index">
                  <div>
                    <i
                      :class="[{ 'el-icon-star-on': val.like }, 'el-icon-star']"
                      @click="favoritHandler(val)"
                    ></i>
                  </div>
                  <div
                    :class="$style.listItem"
                    @click="changeAsset(val.FROMSYMBOL, val.TOSYMBOL)"
                  >
                    <span> {{ val.FROMSYMBOL }}/{{ val.TOSYMBOL }} </span>
                    <span
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
                  </div>
                </li>
              </template>
            </perfect-scrollbar>
          </ul>
        </div>
      </el-tab-pane>
      <!-- ETH -->
      <el-tab-pane label="ETH" name="ETH">
        <div :class="$style.tabContentWrap">
          <div :class="$style.titleWrap">
            <span>Pair</span>
            <span>Price</span>
            <span>Change</span>
          </div>
          <ul :class="$style.contentWrap">
            <perfect-scrollbar :class="$style.ps">
              <template v-for="(val, index) in c_filter_search_list">
                <li :class="$style.listWrap" :key="index">
                  <div>
                    <i
                      :class="[{ 'el-icon-star-on': val.like }, 'el-icon-star']"
                      @click="favoritHandler(val)"
                    ></i>
                  </div>
                  <div
                    :class="$style.listItem"
                    @click="changeAsset(val.FROMSYMBOL, val.TOSYMBOL)"
                  >
                    <span> {{ val.FROMSYMBOL }}/{{ val.TOSYMBOL }} </span>
                    <span
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
                  </div>
                </li>
              </template>
            </perfect-scrollbar>
          </ul>
        </div>
      </el-tab-pane>
      <!-- USDT -->
      <el-tab-pane label="USDT" name="USDT"
        ><div :class="$style.tabContentWrap">
          <div :class="$style.titleWrap">
            <span>Pair</span>
            <span>Price</span>
            <span>Change</span>
          </div>
          <ul :class="$style.contentWrap">
            <perfect-scrollbar :class="$style.ps">
              <template v-for="(val, index) in c_filter_search_list">
                <li :class="$style.listWrap" :key="index">
                  <div>
                    <i
                      :class="[{ 'el-icon-star-on': val.like }, 'el-icon-star']"
                      @click="favoritHandler(val)"
                    ></i>
                  </div>
                  <div
                    :class="$style.listItem"
                    @click="changeAsset(val.FROMSYMBOL, val.TOSYMBOL)"
                  >
                    <span> {{ val.FROMSYMBOL }}/{{ val.TOSYMBOL }} </span>
                    <span
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
                  </div>
                </li>
              </template>
            </perfect-scrollbar>
          </ul>
        </div></el-tab-pane
      >
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
import clone from 'lodash/clone'

export default {
  data() {
    return {
      max: 1,
      coin_list: [],
      search_coin: '',
      activeName: 'USDT',
    }
  },
  computed: {
    ...mapState('asset', ['TSYM']),
    ...mapState('asset', ['FSYM']),
    ...mapState('asset', ['fsyms_list']),
    ...mapState('asset', ['assets_full_data']),
    ...mapGetters('socket', ['displayTicker']),
    c_filter_tab_list() {
      return filter(this.assets_full_data, { TOSYMBOL: this.activeName })
    },
    c_filter_search_list() {
      return !this.search_coin
        ? this.c_filter_tab_list
        : filter(
            this.assets_full_data,
            (el) =>
              !this.search_coin ||
              `${el.FROMSYMBOL.toLowerCase()}/${el.TOSYMBOL.toLowerCase()}`.includes(
                this.search_coin.toLowerCase()
              )
          )
      // return filter(
      //   this.c_filter_tab_list,
      //   (el) =>
      //     !this.search_coin ||
      //     `${el.FROMSYMBOL.toLowerCase()}/${el.TOSYMBOL.toLowerCase()}`.includes(
      //       this.search_coin.toLowerCase()
      //     )
      // )
    },
    c_like_list() {
      return filter(this.assets_full_data, { like: true })
    },
  },
  watch: {
    displayTicker(newValue) {
      let find_asset = find(this.assets_full_data, {
        FROMSYMBOL: newValue.FROMSYMBOL,
        TOSYMBOL: newValue.TOSYMBOL,
      })

      if (find_asset === undefined) return
      if (!newValue.PRICE) return

      find_asset.PRICE = newValue.PRICE
      find_asset.FLAGS = newValue.FLAGS.toString()
      this.$store.dispatch('asset/updateSymbolFullData', find_asset)
    },
  },
  methods: {
    changeAsset(FSYM, TSYM) {
      this.$store.commit('common/ON_LOADING')
      setTimeout(() => {
        this.$store.commit('common/OFF_LOADING')
      }, 2000)
      console.log(FSYM, TSYM)
      this.$store.dispatch('asset/updateSymbol', { FSYM, TSYM })
    },
    calculatePrice(price) {
      return new Decimal(price).toFixed(8)
    },
    calculateChangeDay(openDay, price) {
      return Decimal.sub(price, openDay).div(openDay).mul(100).toFixed(2)
    },
    favoritHandler(obj) {
      this.$store.dispatch('asset/updateFavorit', obj)
    },
    tabClick() {
      if (this.activeName === 'like') return

      let sub_remove_obj = {
        type: 2,
        fsyms: this.fsyms_list,
        tsym: this.TSYM,
      }
      let sub_add_obj = {
        type: 2,
        fsyms: this.fsyms_list,
        tsym: this.activeName,
      }

      this.$store.dispatch('socket/deleteChannelString', sub_remove_obj)
      this.$store.dispatch('socket/addChannelString', sub_add_obj)
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
  .ps {
    height: 500px;
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
    &:hover {
      cursor: pointer;
    }
    padding: 0 5px 15px 5px;
    .listItem {
      display: flex;
      flex: 1 1 0;
      padding: 0 5px;
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
}
</style>
<style>
/* .ps {
  height: 500px;
} */
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
