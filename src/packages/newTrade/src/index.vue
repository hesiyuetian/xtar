<template>
    <div class="sell-buy-right border-box" :style="{'border': !isHead && 'none'}">
        <header class='head' v-if='isHead'>
            <span class='head-item'>最新交易</span>
        </header>

        <ul class='sell-buy-right-con'>
            <li class='qcfd special'>
                <div>成交价({{nowPairInfo.pair && nowPairInfo.pair.split("_")[1]}})</div>
                <div>成交量({{nowPairInfo.pair && nowPairInfo.pair.split("_")[0]}})</div>
                <div>时间</div>
            </li>
            
            <template v-if="newTradList.length > 0">
                <div class='sell-buy-right-con-tant'>
                    <li class='qcfd f-cursor f-hover' :class="{'act-trade-new': item.isnew}" v-for="(item,i) in newTradList" :key='i'>
                        <div :class="{'red': item.side !== 0,'blue': item.side === 0}">{{ toFixed(item.price || 0, nowPairInfo.price_precision) }}</div>
                        <div>{{ toFixed(item.amount || 0, nowPairInfo.amount_precision)}}</div>
                        <div style="overflow-x: hidden">{{(item.timestamp * 1000) | format(1)}}</div>
                    </li>
                </div>
            </template>

            <div v-if="!newTradList || newTradList.length <= 0" class='f-center-y'>
                <xtar-no-data v-if="!loadTrade" class='no-data'></xtar-no-data>
                <xtar-load v-if="loadTrade"></xtar-load>
            </div>
        </ul>

    </div>
</template>

<script>

import { getPrecision } from '../../../lib/mixins/index'
import service from "../../../utils/service";
import load from "../../../utils/loading";
import { watchPubSub } from "../../../watch/index";

export default {
    name: 'XtarNewTrade',
    mixins: [ getPrecision ],
    data(){
        return {
            // 最新交易列表
            newTradList: [],
            // 交易列表是否加载完成
            loadTrade: true
        }
    },
    watch: {
        nowPairInfo(now, pre){
            if(now.pair) this.init()
        }
    },
    props: {
        isHead: {
            type: Boolean,
            default: true
        }
    },
    filters:{
        
    },
    mounted() {
        watchPubSub.scoket( res => {
            if (res.type === 'trade') {
            if (res.result.action == 'insert') {
                
                for (let val of this.newTradList) {
                val.isnew = false;
                }

                for (let item of res.result.data) {
                item.isnew = true;
                }
                
                this.newTradList = [...this.newTradList, ...res.result.data]

                if (this.newTradList.length && this.newTradList.length > 100) {
                this.newTradList = this.newTradList.slice(0, 100);
                }
            }
            }
        })
    },
    methods: {
        init() {
            this.loadTrade = true;
            this.newTrade();
        },

        // 获取二十条交易记录
        newTrade() {
            const success = data => {
                if (data.status === 0) {
                    this.loadTrade = false;
                    this.newTradList = data.data
                    if (this.newTradList.length && this.newTradList.length > 100) this.newTradList.slice(0, 100)
                } else {
                    this.load.tipErrorShow(data.msg);
                }
            }
            service.newTrade({ pair: this.nowPairInfo.pair }).then(res => success(res))
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../../../lib/theme/newtrade.scss';
</style>

