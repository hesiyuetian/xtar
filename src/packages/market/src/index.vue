<template>
  <div class="trad-content-right">
    <div class="deal-market-box">
      <div class="deal-market deal-content-bg">
        <div class="deal-market-price">
          <div class="deal-market-price-title">
            <span
              class="active_hover active-fav"
              :class="{'activated':active === 'optional'}"
              @click="activated('optional')"
            >自选</span>
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
            <!-- <img class="f-cursor" src="../../../../assets/images/search.svg" alt /> -->
            <span class="f-cursor iconfont iconxtar-icon-search"></span>
          </div>
          <div class="deal-market-price-option price-option">
            <div class="trade_tokenName" @click="tickerSort('pair');">
              <div>
                <label>
                  <span>交易对</span>
                  <b>
                    <span
                      class="iconfont iconfilterarrowup"
                      :class="{'act': (type && step == 'pair')}"
                    ></span>
                    <span
                      class="iconfont iconfilterarrowdown"
                      :class="{'act': (!type && step == 'pair')}"
                    ></span>
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
                @click="onSymbolClick(i,i.pair)"
              >
                <span
                  class="iconfont nonal"
                  v-if="i.collected == 1"
                  @click="check(i, true);$event.stopPropagation();"
                >&#xe626;</span>
                <span
                  class="iconfont fav"
                  v-if="i.collected == 0"
                  @click="check(i, false);$event.stopPropagation();"
                >&#xe626;</span>
                <div class="trade_tokenName trade_tokenNames deal-font1">
                  <div class="f-opacity">
                    <span>{{i.pair.replace('_', '/')}}</span>
                  </div>
                </div>
                <div class="index-font3">{{regular.toFixed(i.close || 0, i.priciPrecision)}}</div>
                <div
                  class="change"
                  :class="{'up-color': i.change > 0, 'down-color': i.change < 0, 'normal-color': i.change == 0}"
                >{{regular.toFixed(i.change*100 || 0, 2)}}%</div>
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
// import { ScokeIoService } from '../../../service/scoke-io.service'
// import { SkinServiceService } from '../../../service/skin-service.service'
// import { TrickerService } from '../../../service/tricker.service';

import service from "../../../utils/service";
import regular from "../../../utils/regular";
import { User } from "../../../utils/user";
import stores from "../../../dataStore/index";
import load from "../../../utils/loading";
import reset from "../../../utils/resetData";
// import '../../../lib/theme/font/iconfont.css'
export default {
  name: "XtarMarket",
  data() {
    return {
      // 当前的币种
      symbol: "",
      // 排序
      getTradeAsc: {
        pairs: 1, // 1 升序  2 降序  true  false  交易对
        price: false, // 1 升序  2 降序  true  false 市价
        hours: false // 1 升序  2 降序  true  false 24小时涨跌
      },
      // Market 数据
      symbolListShowData: [],

      collectPairList: "",
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
      //交易对loading状态
      tickerLoadStatus: true,
      // 修改交易对信息，控制不发送交易对精度，只有在初始化时才发送精度
      initStatus: true,
      //防止频繁点击收藏
      isFavStatus: true,

      // 所有交易对精度对象
      pairObj: {}
    };
  },
  created() {},
  filters: {},
  mounted() {
    setTimeout(() => {
      console.log(stores, stores.ticker);
    }, 2000);
    // this.init()
  },
  methods: {
    init() {
      this.user.token() && this.getCollectPair();
      !this.user.token() && this.getPairsList();
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
      this.subTickList(this.tickerList);
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

    // 发布行情数据
    subTickList(data) {
      this.trickerService.setTickList(data);
    },

    // 获取交易对
    async getPairsList() {
      let data;
      await this.reset.getPairs().then(res => {
        data = JSON.parse(JSON.stringify(res));
      });
      for (let item of data) {
        this.pairObj[item.pair] =
          (item.amount_precision || 0) + "_" + (item.price_precision || 0);
      }
      this.getTickersList();
    },

    //获取交易对 - new
    getTickersList() {
      let data = {};
      this.service.getPairsList(data).then(res => {
        if (res.status == 0) {
          for (let item of res.data) {
            item["amountPrecision"] = Number(
              this.pairObj[`${item.pair}`].split("_")[0] || 4
            );
            item["priciPrecision"] = Number(
              this.pairObj[`${item.pair}`].split("_")[1] || 4
            );
          }

          this.subTickList(res.data);
          this.tickerLoadStatus = false;
          this.tickerList = res.data;
          this.getSymbolList(res.data);
          this.analysisTicker();
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
        this.active = this.active ? this.active : this.tickerList[0].symbol;
        for (let i of this.tickerList) {
          if (
            this.user.token() &&
            this.collectPairList &&
            this.collectPairList.length > 0
          ) {
            let Index = this.collectPairList.findIndex(ele => {
              return ele === i.pair;
            });
            i.collected = Index == -1 ? 1 : 0;
          } else i.collected = 1;

          if (this.active === "optional" && i.collected === 0) {
            this.marketList.push(i);
            if (this.tokenName) {
              this.onTokenNameChange();
            } else {
              this.marketShowList = this.marketList;
            }
          } else if (this.active == i.pair.split("_")[1]) {
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

    //获取收藏列表
    getCollectPair() {
      let data = {};
      this.service.getCollectPair(data).then(res => {
        if (res.status == 0) {
          this.collectPairList = res.data;
          this.subCollectList(res.data);
          this.getPairsList();
        }
      });
    },

    //选中自选
    check(i, active) {
      if (this.user.token()) {
        this.checkTicker(i.pair, active);
      } else {
        this.unLogin();
      }
    },

    alert(config) {
      this.dialog.createFromComponent(ConterAlertComponent, config);
    },

    unLogin() {
      const config = {
        tip: this.translate.instant("common.unLogin"),
        tipKey: this.translate.instant("common.unLoginTip"),
        ok: this.translate.instant("Header.login"),
        callbackSure: () => {
          this.router.navigateByUrl(
            `/user/login?forward=/trade/${this.symbol}`
          );
        },
        callbackCancel: () => {}
      };
      this.alert(config);
    },

    //收藏选中的交易对
    checkTicker(ticker, active) {
      if (this.isFavStatus) {
        this.isFavStatus = false;
        let data = {
          pair: ticker,
          collect: active
        };
        this.service.collectPair(data).then(res => {
          this.isFavStatus = true;
          if (res.status === 0) {
            this.collectPairList = res.data;
            this.subCollectList(res.data);
            this.analysisTicker();
          } else {
            this.load.tipErrorShow(res.msg);
          }
        });
      }
    }, // 广播收藏的交易对list

    subCollectList(data) {
      let json = {
        type: "set",
        data: data
      };
      this.trickerService.set(json);
    },

    //点击交易对时
    onSymbolClick(info, symbol) {
      this.active = symbol.split("_")[1];
      console.log(symbol, "symbol==symbol");
      this.router.navigateByUrl("trade/" + symbol);
      this.user.setItem("defaultSymbol", symbol);
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
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
// @import url('../../../lib/theme/reset.scss');
// @import url('../../../lib/theme/variable.scss');

@import '../../../lib/theme/reset.scss';
@import '../../../lib/theme/variable.scss';
@import '../../../lib/theme/market.scss';
</style>

