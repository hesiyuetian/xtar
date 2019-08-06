<template>
  <div class="trad-foot border-box">
    <div class="trad-foot-head qcfd">
      <span
        class="trad-foot-head-item f-cursor f-fl"
        @click="change(0)"
        :class="{'act': muneIndex === 0}"
      >委托中</span>
      <span
        class="trad-foot-head-item f-cursor f-fl"
        @click="change(1)"
        :class="{'act': muneIndex === 1}"
      >委托历史</span>
    </div>
    <ul class="trad-foot-con">
      <li class="trad-foot-con-item">
        <div class="line special qcfd">
          <div class="trad-foot-con-item-item border-box f-fl">时间</div>
          <div class="trad-foot-con-item-item border-box f-fl">方向</div>
          <div class="trad-foot-con-item-item border-box f-fl">交易对</div>
          <div
            class="trad-foot-con-item-item border-box f-fl"
          >单价({{symbol.split('_')[1]}})</div>
          <div
            class="trad-foot-con-item-item border-box f-fl"
          >数量({{symbol.split('_')[0]}})</div>

          <!-- 委托中 -->
          <div
            class="trad-foot-con-item-item border-box f-fl"
            v-if="muneIndex === 0"
          >已成交({{symbol.split('_')[0]}})</div>
          <div
            class="trad-foot-con-item-item border-box f-fl"
            v-if="muneIndex === 0"
          >未成交({{symbol.split('_')[0]}})</div>

          <!-- 委托历史 -->
          <div
            class="trad-foot-con-item-item border-box f-fl"
            v-if="muneIndex === 1"
          >已成交({{symbol.split('_')[0]}})</div>
          <div
            class="trad-foot-con-item-item border-box f-fl"
            v-if="muneIndex === 1"
          >成交均价({{symbol.split('_')[1]}})</div>

          <div class="trad-foot-con-item-item border-box f-fl">状态</div>
          <div
            class="trad-foot-con-item-item border-box f-fl"
            v-if="muneIndex === 0"
          >操作</div>
          <div class="trad-foot-con-item-item border-box f-fl" v-if="muneIndex === 1"></div>
        </div>
      </li>
      <div class="con" v-if="orderList.length > 0">
        <li class="trad-foot-con-item" v-for="(item,index) in orderList" :key="index">
          <div class="line hover qcfd f-opacity">
            <div class="trad-foot-con-item-item border-box f-fl">{{item.create_time | utcTolocal}}</div>
            <div
              class="trad-foot-con-item-item border-box f-fl"
            >{{item.side | transactionStatus}}</div>
            <div
              class="trad-foot-con-item-item border-box f-fl"
            >{{pairSplit(item.pair,0)}}/{{pairSplit(item.pair,1)}}</div>
            <div
              class="trad-foot-con-item-item border-box f-fl"
            >{{toFixed(item.price,precision.pricePrecision)}}</div>
            <div
              class="trad-foot-con-item-item border-box f-fl"
            >{{toFixed(item.amount,precision.amountPrecision)}}</div>

            <!-- 委托中 -->
            <div
              class="trad-foot-con-item-item border-box f-fl"
              v-if="muneIndex === 0"
            >{{toFixed(item.filled_amount,precision.amountPrecision)}}</div>
            <div
              class="trad-foot-con-item-item border-box f-fl"
              v-if="muneIndex === 0"
            >{{ item.amount | toModulo(item.filled_amount,precision.amountPrecision)}} </div>

            <!-- 委托历史 -->
            <div
              class="trad-foot-con-item-item border-box f-fl"
              v-if="muneIndex === 1"
            >{{toFixed(item.filled_amount,precision.amountPrecision)}}</div>
            <div
              class="trad-foot-con-item-item border-box f-fl"
              v-if="muneIndex === 1"
            >{{toFixed(item.avg_price || "0",precision.amountPrecision)}}</div>

            <div
              class="trad-foot-con-item-item border-box f-fl"
            >{{item.status | orderStatus}}</div>
            <div class="trad-foot-con-item-item border-box action f-fl">
              <span
                class="f-cursor detail"
                v-if="item.status == 2 || item.status == 3 || (item.status == 4 && toNumber(item.filled_amount) != 0)"
                @click="orderDetial(item.order_id,index)"
              >
                details
                <i
                  class="labels iconfont iconfilterarrowdown"
                  :class="{'animation-triangle': detailKey == index}"
                ></i>
              </span>
              <span
                class="f-cursor revoke"
                v-if="muneIndex === 0 && (item.status == 0 || item.status == 1 || item.status == 2)"
                @click="cancel(item.order_id)"
              >撤销</span>
            </div>
          </div>

          <div class="trad-foot-con-item-detail" v-if="detailKey == index">
            <div class="trad-foot-con-item-detail-item">
              <div>时间</div>
              <div>单价({{pairSplit(item.pair,1)}})</div>
              <div>数量({{pairSplit(item.pair,0)}})</div>
              <div>成交量({{pairSplit(item.pair,1)}})</div>
              <div>手续费({{item.side === 0 ? pairSplit(item.pair,1) : pairSplit(item.pair,0)}})</div>
              <div>状态</div>
              <div>TxId</div>
            </div>
            <div
              class="trad-foot-con-item-detail-item"
              v-for="(val,index) in detailDetailList"
              :key="index"
            >
              <div>{{val.finish_time | utcTolocal }}</div>
              <div>{{toFixed(val.trade_price,precision.pricePrecision)}}</div>
              <div>{{toFixed(val.trade_amount,precision.amountPrecision)}}</div>
              <div>{{toFixed(val.trade_total,precision.basePrecision)}}</div>
              <div>{{val.fee}}</div>
              <div>{{ val.status | tradStatus}}</div>
              <div
                class="f-cursor link"
                :class="{'fail': val.status == 5}"
                @click="val.tx_id && auxBxa.getOrderInfo(val.tx_id)"
              >{{sensitiveCheck(val.tx_id)}}</div>
            </div>
          </div>
        </li>
      </div>

      <div class="trad-foot-con-unlogin f-opacity" v-if="!token()">
        您必须<a :href="forward">登录</a>才可看到此信息
      </div>
      <div style="margin-top: 20px;" v-if="token() && orderList.length <= 0">
        <xtar-load v-if="loadTrade"></xtar-load>
        <xtar-no-data v-if="!loadTrade"></xtar-no-data>
      </div>
    </ul>
  </div>
</template>

<script>
import { getPrecision } from '../../../lib/mixins/index'
import service from "../../../utils/service";
import regular from "../../../utils/regular";
import { User } from "../../../utils/user";
import stores from "../../../dataStore/index";
import load from "../../../utils/loading";
import reset from "../../../utils/resetData";

export default {
    name: 'XtarOrderList',
    mixins: [ getPrecision ],
    data(){
        return {
            forward: '',
            symbol: '',

            // 当前币对精度
            precision: {
                amountPrecision: 4,
                basePrecision: 4,
                pricePrecision: 4,
                minSize: 1
            },
            muneIndex: 0,
            orderList: [],
            loadTrade: true,

            timer: null,
            detailKey: null,
            orderId: '',
            detailDetailList: [],

            fullscreenStatus: false
        }
    },
    watch: {
        nowPairInfo(now, pre){
            if(now.pair) this.init()
        }
    },
    created() {
    },
    filters:{
        toModulo(amount, filled_amount, precision){
            return regular.toModulo(amount,filled_amount, precision)
        }
    },
    mounted() {
        this.init()
    },
    beforeDestroy(){
        clearInterval(this.timer)
    },
    methods: {
        init() {
            clearInterval(this.timer);
            User.token() && this.throttle();
            if (User.token()) this.loadTrade = true;
        },

        //切换委托单/历史订单方法
        change(number) {
            this.detailKey = null;
            this.orderList = [];
            if (User.token()) this.loadTrade = true;
            this.muneIndex = number;
            User.token() && this.getOrderList()
        },

        //获取委托单列表
        getOrderList(page) {
            if(!page) page = 1;
            let sList = this.muneIndex == 0 ? '0, 1, 2, 5' : '3, 4';
            let params = {
                "begin": '',
                "end": '',
                "side": '',
                "page_num": page,
                "page_size": 20,
                "status": sList,
                "pair": this.symbol,
            }

            const success = data => {
                this.loadTrade = false;
                if(data.status === 0){
                    this.orderList = data.data.list;
                    if(this.detailKey != null){
                        const findex = this.orderList.findIndex((ele) => {
                            return ele.order_id === this.orderId;
                        })
                        
                        if(findex != -1 && (this.orderList[findex].status ==2 || this.orderList[findex].status == 3)){
                            this.detailKey = findex;
                        }else this.detailKey = null;
                    }
                }else load.tipErrorShow(data.msg)
            }
            service.list(params).then(res => success(res))
        },

        cancel(orderId) {
            // const config = {
            //     tip: this.translate.instant('tradeFoot.cancelOrder'),
            //     ok: this.translate.instant('common.send'),
            //     callbackSure: ()=>{
            //         this.cancelOrder(orderId)
            //     },
            //     callbackCancel: ()=>{ },
            // }
            // this.dialog.createFromComponent(ConterAlertComponent,config)
        },

        //撤单
        cancelOrder(ids) {
            let params = {
                ids: ids
            }
            const success = data => {
                if (data.status === 0) {
                    load.tipSuccessShow('撤单成功');
                    this.init();
                } else {
                    load.tipErrorShow(data.msg);
                }
            }
            service.cancel(params).then(res => success(res))
        },
        //订单详情
        orderDetial(orderId, index) {
            if(this.detailKey === index) return this.detailKey = null;

            this.orderId = orderId;
            let data = {
                order_id: orderId, 
            }
            service.tradeList(data).then(res => {
                if (res.status == 0) {
                    this.detailDetailList = res.data.result;
                    this.detailKey = index;
                }
            })
        },

        throttle(action) {
            clearInterval(this.timer);
            this.getOrderList();
            this.timer = setInterval(()=>{
                this.getOrderList();
            },6000)
        },

        link() { 
            if(User.token()) this.router.navigateByUrl('/order')
            else this.unLogin()
        },

        unLogin() {
            // const config = {
            //     tip: this.translate.instant('common.unLogin'),
            //     tipKey: this.translate.instant('common.unLoginTip'),
            //     ok: this.translate.instant('Header.login'),
            //     callbackSure: () => {
            //         this.router.navigateByUrl(`/user/login?forward=/trade/${this.symbol}`)
            //     },
            //     callbackCancel: () => { },
            // }
            // this.dialog.createFromComponent(ConterAlertComponent, config)
        },

        // 交易对切割
        pairSplit(pair,index){
            return pair.split('_')[index]
        },
        
        favSymbol(status,type){
            this[type] = status;
        },

        sensitiveCheck(str){
            return regular.sensitiveCheck(str)
        },
        toNumber(num){
            return regular.toNumber(num)
        }
        
    }
};
</script>

<style lang="scss" scoped>
@import '../../../lib/theme/orderlist.scss';
</style>

