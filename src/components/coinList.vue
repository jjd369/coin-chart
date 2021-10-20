<template>
  <div class="contentWrap">
    <div class="searchBox">
      <el-input placeholder="search" v-model="search_coin"></el-input>
    </div>
    <el-tabs type="card" v-model="activeName" @tab-click="tabClick">
      <!-- 관심 목록 -->
      <el-tab-pane name="like">
        <span slot="label"><i class="el-icon-star el-icon-star-on"></i></span>
        <div class="tabContent">
          <div v-if="!c_like_list.length" class="noContenteBox">
            <p>관심 목록이 없습니다.</p>
            <p>별 아이콘을 눌러서 관심 목록에 추가해주세요.</p>
          </div>
          <div v-else>
            <div class="titleWrap">
              <span>Pair</span>
              <span>Price</span>
              <span>Change</span>
            </div>
            <ul>
              <perfect-scrollbar>
                <template v-for="(val, index) in c_like_list">
                  <li class="listWrap" :key="index">
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
                      class="listItem"
                      @click="changeAsset(val.FROMSYMBOL, val.TOSYMBOL)"
                    >
                      <span> {{ val.FROMSYMBOL }}/{{ val.TOSYMBOL }} </span>
                      <span :class="val.FLAGS === '1' ? 'green' : 'red'">
                        {{ calculatePrice(val.PRICE) }}
                      </span>
                      <span
                        :class="
                          calculateChangeDay(val.OPENDAY, val.PRICE) > 0
                            ? 'green'
                            : 'red'
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
        <div class="tabContent">
          <div class="titleWrap">
            <span>Pair</span>
            <span>Price</span>
            <span>Change</span>
          </div>
          <ul>
            <perfect-scrollbar>
              <template v-for="(val, index) in c_filter_search_list">
                <li class="listWrap" :key="index">
                  <div>
                    <i
                      :class="[{ 'el-icon-star-on': val.like }, 'el-icon-star']"
                      @click="favoritHandler(val)"
                    ></i>
                  </div>
                  <div
                    class="listItem"
                    @click="changeAsset(val.FROMSYMBOL, val.TOSYMBOL)"
                  >
                    <span> {{ val.FROMSYMBOL }}/{{ val.TOSYMBOL }} </span>
                    <span :class="val.FLAGS === '1' ? 'green' : 'red'">
                      {{ calculatePrice(val.PRICE) }}
                    </span>
                    <span
                      :class="
                        calculateChangeDay(val.OPENDAY, val.PRICE) > 0
                          ? 'green'
                          : 'red'
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
        <div class="tabContent">
          <div class="titleWrap">
            <span>Pair</span>
            <span>Price</span>
            <span>Change</span>
          </div>
          <ul>
            <perfect-scrollbar>
              <template v-for="(val, index) in c_filter_search_list">
                <li class="listWrap" :key="index">
                  <div>
                    <i
                      :class="[{ 'el-icon-star-on': val.like }, 'el-icon-star']"
                      @click="favoritHandler(val)"
                    ></i>
                  </div>
                  <div
                    class="listItem"
                    @click="changeAsset(val.FROMSYMBOL, val.TOSYMBOL)"
                  >
                    <span> {{ val.FROMSYMBOL }}/{{ val.TOSYMBOL }} </span>
                    <span :class="val.FLAGS === '1' ? 'green' : 'red'">
                      {{ calculatePrice(val.PRICE) }}
                    </span>
                    <span
                      :class="
                        calculateChangeDay(val.OPENDAY, val.PRICE) > 0
                          ? 'green'
                          : 'red'
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
        ><div class="tabContent">
          <div class="titleWrap">
            <span>Pair</span>
            <span>Price</span>
            <span>Change</span>
          </div>
          <ul>
            <perfect-scrollbar>
              <template v-for="(val, index) in c_filter_search_list">
                <li class="listWrap" :key="index">
                  <div>
                    <i
                      :class="[{ 'el-icon-star-on': val.like }, 'el-icon-star']"
                      @click="favoritHandler(val)"
                    ></i>
                  </div>
                  <div
                    class="listItem"
                    @click="changeAsset(val.FROMSYMBOL, val.TOSYMBOL)"
                  >
                    <span> {{ val.FROMSYMBOL }}/{{ val.TOSYMBOL }} </span>
                    <span :class="val.FLAGS === '1' ? 'green' : 'red'">
                      {{ calculatePrice(val.PRICE) }}
                    </span>
                    <span
                      :class="
                        calculateChangeDay(val.OPENDAY, val.PRICE) > 0
                          ? 'green'
                          : 'red'
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
      let calculate_price
      this.activeName === 'USDT'
        ? (calculate_price = new Decimal(price).toFixed(2))
        : (calculate_price = new Decimal(price).toFixed(8))
      return calculate_price
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
