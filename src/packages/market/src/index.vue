<template>
  <div class="trad-content-right">
    <div class="deal-market-box">
      <div class="deal-market deal-content-bg">
        <div class="deal-market-price">
          <div class="deal-market-price-title">
            <span
              class="index-white-color"
              :class="{'activated':active === i}"
              @click="activated(i)"
              v-for="(i,index) of symbolList"
              :key="index"
            >{{i}}</span>
          </div>

          <div class="deal-market-price-search border-box">
            <input
              type="text"
              placeholder="Search"
              class="deal-font1 f-opacity"
              v-model="tokenName"
              @keyup="onTokenNameChange()"
            />
            <img class='f-cursor search' src="https://beta.lyra.site/assets/images/search.svg" alt="">
            <!-- <i class="f-cursor search iconfont iconxtar-icon-search"></i> -->
          </div>
          <div class="deal-market-price-option price-option">
            <div class="trade_tokenName" @click="tickerSort('pair');">
              <div>
                <label>
                  <span>交易对</span>
                  <b>
                    <i
                      class="iconfont iconfilterarrowup"
                      :class="{'act': (type && step == 'pair')}"
                    ></i>
                    <i
                      class="iconfont iconfilterarrowdown"
                      :class="{'act': (!type && step == 'pair')}"
                    ></i>
                  </b>
                </label>
              </div>
            </div>

            <div class="trade_marketPrice_box" @click="tickerSort('close');">
              <div class="trade_marketPrice">
                <label>
                  <span>价格</span>
                  <b>
                    <i
                      class="iconfont iconfilterarrowup"
                      :class="{'act': (type && step == 'close')}"
                    ></i>
                    <i
                      class="iconfont iconfilterarrowdown"
                      :class="{'act': (!type && step == 'close')}"
                    ></i>
                  </b>
                </label>
              </div>
            </div>

            <div class="trade_hours" @click="tickerSort('change');">
              <div class="trade_upDown">
                <label>
                  <span>涨幅</span>
                  <b>
                    <i
                      class="iconfont iconfilterarrowup"
                      :class="{'act': (type && step == 'change')}"
                    ></i>
                    <i
                      class="iconfont iconfilterarrowdown"
                      :class="{'act': (!type && step == 'change')}"
                    ></i>
                  </b>
                </label>
              </div>
            </div>
          </div>

          <div class="deal-market-price-content scroll_color scrollBeautiful">
            <div v-if="!marketShowList || marketShowList.length <= 0" style="margin-top: 100px;"></div>

            <div class="scroll-y">
              <div
                class="symbolListShowData deal-market-price-option f-hover f-cursor"
                v-for="(i,index) of marketShowList"
                :key="index"
                :class="{'active-bg': symbol == i.pair}"
              >
                <div class="trade_tokenName trade_tokenNames deal-font1">
                  <div class="f-opacity">
                    <span>{{i.pair.replace('_', '/')}}</span>
                  </div>
                </div>
                <div class="index-font3">
                  {{toFixed(i.close || 0, i.price_precision)}}
                  </div>
                <div
                  class="change"
                  :class="{'up-color': i.change > 0, 'down-color': i.change < 0, 'normal-color': i.change == 0}"
                >
                {{toFixed(i.change*100 || 0, 2)}}%
                </div>
              </div>
            </div>
            <span class="scrollBar"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BigNumber from "bignumber.js";

import { getPrecision } from '../../../lib/mixins/index'
import service from "../../../utils/service";
import regular from "../../../utils/regular";
import { User } from "../../../utils/user";
import load from "../../../utils/loading";
import reset from "../../../utils/resetData";
import xtarUtil from "../../../utils/xtarUtil";
import { watchPubSub } from "../../../watch/index";

export default {
  name: "XtarMarket",
  mixins: [ getPrecision ],
  data() {
    return {
      // 当前的币种
      symbol: "",
      
      //交易对全部列表
      tickerList: "",
      //默认选中基础货币
      active: "",
      //基础货币列表
      symbolList: "",
      //交易对列表
      marketShowList: [],
      marketList: "",
      //收藏交易对
      kind: "",
      // 排序list下标
      step: "",
      // 目标排序方向
      type: false,
      //搜索
      tokenName: "",
    };
  },
  created() {
  },
  watch: {
    nowPairInfo(now, pre){
      if(now.pair) this.init()
    }
  },
  filters: {},
  mounted() {
    watchPubSub.scoket( res => {
      if (res.type === 'ticker' && !!res.result.data.pair) {
				this.setWSPrice(res.result.data)
			}
    })
  },
  methods: {
    init() {
      reset.getTicker().then( res => {
         this.tickerList = res;
         this.getSymbolList(res);
         this.analysisTicker();
         this.activated(this.nowPairInfo.quote)
      })
    },

    toFixed(val,fixed){
      return regular.toFixed(val,fixed)
    },

    // ws推送价格
    setWSPrice(data) {
      if (!this.tickerList || this.tickerList.length == 0) {
        return;
      }
      let findIndex = this.tickerList.findIndex(val => {
        return val.pair === data.pair;
      });
      if (findIndex != -1 && this.tickerList[findIndex].v < data.v) {
        this.tickerList[findIndex].v = data.v;
        this.tickerList[findIndex].close = data.close;
        this.tickerList[findIndex].change = data.change;
        this.analysisTicker();
      }
    },

    //排序
    tickerSort(type) {
      this.step = type;
      this.type = this.kind != type ? false : true;
      this.sort(type, this.type);
      this.kind = !this.type ? type : "";
    },

    sort(type, direction) {
      if (!this.marketShowList) return;
      this.marketShowList.sort((pre, next) => {
        let result = false;
        if (type == "pair") {
          result = pre[type] > next[type];
        } else {
          result =
            new BigNumber(pre[type]).isGreaterThan(new BigNumber(next[type])) ||
            (new BigNumber(pre[type]).isEqualTo(new BigNumber(next[type])) &&
              pre["tokenName"] > next["tokenName"]);
        }
        if (result) {
          return direction ? 1 : -1;
        } else {
          return direction ? -1 : 1;
        }
      });
    },

    // 解析获取基础货币列表
    getSymbolList(data) {
      this.symbolList = [];
      let quoteList = [];
      for (let item of data) {
        quoteList.push(item.pair.split("_")[1]);
      }
      this.symbolList = quoteList.filter((ele, index, self) => {
        return self.indexOf(ele) === index;
      });
    },

    //解析处理展示的交易对  
    analysisTicker() {
      (this.marketList = []), (this.marketShowList = []);
      if (this.tickerList && this.tickerList.length > 0) {
        for (let i of this.tickerList) {
          if (this.active == i.pair.split("_")[1]) {
            this.marketList.push(i);
            if (this.tokenName) {
              this.onTokenNameChange();
            } else {
              this.marketShowList = this.marketList;
            }
          }
        }
      }
    },

    // 切换自选与BaseToken 
    activated(val) {
      this.step = "";
      this.active = val;
      this.analysisTicker();
    },

    //搜索交易对
    onTokenNameChange() {
      this.marketShowList = this.marketList.filter(data => {
        return (
          data.pair
            .toLocaleLowerCase()
            .indexOf(this.tokenName.toLocaleLowerCase().replace("/", "_")) !==
          -1
        );
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../../lib/theme/market.scss';
</style>

