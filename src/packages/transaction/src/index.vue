<template>
    <div class="sell-buy-left border-box"> 
        <div class='sell-buy-left-con border-box qcfd' :class="{'model': modeSel == 'tile'}">
            <!-- 买入 -->
            <div class='sell-buy-left-con-item border-box f-fl'  v-if="modeSel == 'traditional' || (modeSel == 'tile' && side == 'buy')">
                <div v-if="modeSel == 'traditional'" class='sell-buy-left-con-item-blance border-box'>
                    <span class='sell-buy-left-con-item-blance-item head-act f-opacity'>限价交易</span>
                    <span class='f-fr balance f-opacity'>
                        <span>余额</span> {{baseBalance || 0}}  <span>{{nowPairInfo.pair && nowPairInfo.pair.split('_')[1]}}</span>
                    </span>
                </div>

                <div v-if="modeSel == 'tile'" class='sell-buy-left-con-item-model-tile border-box'>
                    <div class='act'>买入</div>
                    <div @click='side = "sell"'>卖出</div>
                </div>

                <p v-if="modeSel == 'tile'" class='sell-buy-left-con-item-balance qcfd'>
                    <span class='f-fl f-opacity-t'>余额</span>
                    <span class='f-fr balances'>
                        <span class='f-opacity'>{{baseBalance || 0}} </span>
                        <span class='f-opacity-t'>{{nowPairInfo.pair && nowPairInfo.pair.split('_')[1]}}</span>
                    </span>
                </p>
                <div class='sell-buy-left-con-item-price border-box qcfd' :class="{'model-prices': modeSel == 'tile'}">
                    <span class='sell-buy-left-con-item-price-title'>单价</span>
                    <input type="text" v-model="buyPrice"
                        @keydown="onInputKeyDown($event)" 
                        @keyup="onModelChange('buyPrice', buyPrice, nowPairInfo.price_precision)">
                    <span class='sell-buy-left-con-item-price-symbol'>{{nowPairInfo.pair && nowPairInfo.pair.split('_')[1]}}</span>
                </div>
                
                <div class='sell-buy-left-con-item-price sell-buy-left-con-item-prices qcfd' :class="{'model-prices model-prices-t': modeSel == 'tile'}">
                    <span class='sell-buy-left-con-item-price-title'>数量</span>
                    <input type="text" :class="{'fail': buyTipFlag}" v-model="buyNum"
                        @keydown="onInputKeyDown($event)"
                        :placeholder="'最小下单数量: '+ toNumbers(nowPairInfo.min_amount)"
                        @keyup="onModelChange('buyNum', buyNum, nowPairInfo.amount_precision)">
                    <span class='sell-buy-left-con-item-price-symbol'>{{nowPairInfo.pair && nowPairInfo.pair.split('_')[0]}}</span>
                    <p class='sell-buy-left-con-item-price-tip' v-if="buyTipFlag">
                        <span></span>
                        最小下单数量: {{toNumbers(nowPairInfo.min_amount)}}
                    </p>
                </div>
            
                <div class='sell-buy-left-con-item-relx qcfd' :class="{'model-relx': modeSel == 'tile'}">
                    <div class='sell-buy-left-con-item-relx-item noselect' @click='token() && !!buyPrice && raleBuy(0.25)'>25%</div>
                    <div class='sell-buy-left-con-item-relx-item noselect' @click='token() && !!buyPrice && raleBuy(0.5)'>50%</div>
                    <div class='sell-buy-left-con-item-relx-item noselect' @click='token() && !!buyPrice && raleBuy(0.75)'>75%</div>
                    <div class='sell-buy-left-con-item-relx-item noselect' @click='token() && !!buyPrice && raleBuy(1)'>100%</div>
                    <div class='sell-buy-left-con-item-money f-opacity f-fr'>
                        交易额 = <span>{{(buyNum && buyPrice) ? toBigsells([buyNum,buyPrice],nowPairInfo.price_precision || 0) : '0' }} {{nowPairInfo.pair && nowPairInfo.pair.split('_')[1]}}</span>
                    </div>
                </div>

                <div class='sell-buy-left-con-item-btn noselect'  v-if="token()" @click='buy()'> 买入 {{nowPairInfo.pair && nowPairInfo.pair.split('_')[0]}}</div>
                <div class='sell-buy-left-con-item-btn login noselect'  v-if="!token()" @click='login(true)'>登录</div>
            </div>
            
            <!-- 卖出 --> 
            <div class='sell-buy-left-con-item border-box f-fl' v-if="modeSel == 'traditional' || (modeSel == 'tile' && side == 'sell')">
                <div  v-if="modeSel == 'traditional'" class='sell-buy-left-con-item-blance border-box'>
                    <span class='sell-buy-left-con-item-blance-item head-act f-opacity'>限价交易</span>
                    <span class='f-fr balance f-opacity'>
                        <span>余额</span>  {{quoteBalance || 0}}  <span>{{nowPairInfo.pair && nowPairInfo.pair.split('_')[0]}}</span>
                    </span>
                </div>

                <div  v-if="modeSel == 'tile'" class='sell-buy-left-con-item-model-tile border-box'>
                    <div @click='side = "buy"'>买入</div>
                    <div class='act'>卖出</div>
                </div>

                <p v-if="modeSel == 'tile'" class='sell-buy-left-con-item-balance qcfd'>
                    <span class='f-fl f-opacity-t'>余额</span>
                    <span class='f-fr balances'>
                        <span class='f-opacity'>{{quoteBalance || 0}} </span>
                        <span class='f-opacity-t'>{{nowPairInfo.pair && nowPairInfo.pair.split('_')[0]}}</span>
                    </span>
                </p>
                <div class='sell-buy-left-con-item-price border-box qcfd' :class="{'model-prices': modeSel == 'tile'}">
                    <span class='sell-buy-left-con-item-price-title'>单价</span>
                    <input type="text" v-model="sellPrice"
                        @keydown="onInputKeyDown($event)"
                        @keyup="onModelChange('sellPrice', sellPrice, nowPairInfo.price_precision)">
                    <span class='sell-buy-left-con-item-price-symbol'>{{nowPairInfo.pair && nowPairInfo.pair.split('_')[1]}}</span>
                </div>

                <div class='sell-buy-left-con-item-price sell-buy-left-con-item-prices qcfd' :class="{'model-prices model-prices-t': modeSel == 'tile'}">
                    <span class='sell-buy-left-con-item-price-title'>数量</span>
                    <input type="text" :class="{'fail': sellTipFlag}" v-model="sellNum"
                        @keydown="onInputKeyDown($event)"
                        :placeholder="'最小下单数量: '+ toNumbers(nowPairInfo.min_amount)"
                        @keyup="onModelChange('sellNum', sellNum, nowPairInfo.amount_precision)">
                    <span class='sell-buy-left-con-item-price-symbol'>{{nowPairInfo.pair && nowPairInfo.pair.split('_')[0]}}</span>
                    <p class='sell-buy-left-con-item-price-tip' v-if="sellTipFlag">
                        <span></span>
                        最小下单数量: {{toNumbers(nowPairInfo.min_amount)}}
                    </p>
                </div>

                <div class='sell-buy-left-con-item-relx sell-relx qcfd' :class="{'model-relx': modeSel == 'tile'}">
                    <div class='sell-buy-left-con-item-relx-item noselect' @click='token() && !!sellPrice && raleSell(0.25)'>25%</div>
                    <div class='sell-buy-left-con-item-relx-item noselect' @click='token() && !!sellPrice && raleSell(0.5)'>50%</div>
                    <div class='sell-buy-left-con-item-relx-item noselect' @click='token() && !!sellPrice && raleSell(0.75)'>75%</div>
                    <div class='sell-buy-left-con-item-relx-item noselect' @click='token() && !!sellPrice && raleSell(1)'>100%</div>
                    <div class='sell-buy-left-con-item-money f-opacity f-fr'>
                        交易额 = <span>{{(sellPrice && sellNum) ? toBigsells([sellNum,sellPrice],nowPairInfo.price_precision || 0) : '0'}} {{nowPairInfo.pair && nowPairInfo.pair.split('_')[1]}}</span>
                    </div>
                </div>

                <div class='sell-buy-left-con-item-btn sell-btn noselect' v-if="token()" @click='sell()'> 卖出 {{nowPairInfo.pair && nowPairInfo.pair.split('_')[0]}}</div>
                <div class='sell-buy-left-con-item-btn login sell-btn noselect' v-if="!token()" @click='login(true)'>登录</div>
            </div>

        </div>
        <xtar-pwd v-if="dialogPwd" :config='config'></xtar-pwd>
        <xtar-unlock v-if='unlockFlag' @close='login'></xtar-unlock>
    </div>
</template>

<script>

import { getPrecision } from '../../../lib/mixins/index'
import service from "../../../utils/service";
import regular from "../../../utils/regular";
import { User } from "../../../utils/user";
import load from "../../../utils/loading";
import reset from "../../../utils/resetData";
import xtarSign from "../../../utils/xtarSign";
import { CONFIG } from '../../../utils/config'
export default {
    name: "XtarTransaction",
    mixins: [ getPrecision ],
    data(){
        return {
            unlockFlag: false,
            side: 'buy',
            
            timer: null,
            // 渠道
            channel: 'AUZ4d82hCeLhKS6nhvz9gRApKfjJwyVQ8B',

            // 买卖交易

            // 买入
            buyPrice: '',
            buyNum: '',
            buyOdexFee: '',
            buyTipFlag: false,
            // 卖出
            sellPrice: '',
            sellNum: '',
            sellOdexFee: '',
            sellTipFlag: false,

            // 账户余额
            baseBalance: '',
            quoteBalance: '',
            
            // 当交易对下架或者不存在
            defaultPair: '',
            
            // 密码确认
            dialogPwd: false,
            config: {}
        }
    },
    props: {
        // 界面模式  traditional ： 传统模式      tile ： 平铺模式
        modeSel: {
            type: String,
            default: 'tile'
        }
    },
    watch: {
        nowPairInfo(now, pre){
            if(now.pair){
                this.buyPrice = this.sellPrice = now.close
                this.init()
            }
        }
    },
    mounted() {
    },
    methods: {
        init(){
            Promise.all([this.token() && this.throttle(), this.resetTrad(),this.token() && this.getBalanceToken()]) ;
        },

        //  初始化
        resetTrad(){
            this.buyNum = '' , this.buyTipFlag = false;
            this.sellNum = '', this.sellTipFlag = false;
        },

        // 查询余额
        getBalanceToken(){
            let params = {
                symbol: `${this.nowPairInfo.pair.split('_')[0]},${this.nowPairInfo.pair.split('_')[1]}`,
            }
            const success = data => {
                if(data.status === 0){
                    this.baseBalance= data.data[1].available;
                    this.quoteBalance= data.data[0].available;
                }else{
                    load.tipErrorShow(data.msg);
                }
            }
            service.getBalance(params).then( res => success(res) )
        },

        // 设置买卖价格
        setPrice(price){
            if(price != '---'){
                this.buyPrice = regular.toFixed(price,this.nowPairInfo.price_precision);
                this.sellPrice = regular.toFixed(price,this.nowPairInfo.price_precision);
            }
        },

        //输入限制 onkeydown
        onInputKeyDown(event) {
            let inputKey = (event && event.key) || '0';
            if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '。', 'Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'].indexOf(inputKey) === -1) {
                event.preventDefault();
                return;
            }
        },

        //输入限制 ngModelChange
        onModelChange(params, event, decimalPointNumber) {
            if(!!!decimalPointNumber) decimalPointNumber = 8
            setTimeout(() => {
                this[params] = regular.filterNumberPipe(event, decimalPointNumber);
            }, 0);
        },

        //微调整数量 params:price_buy action:plus/minus value:value
        onNumberChange(params, action, value) {
            if (value) {
                let len = 0;
                let v = 0;
                if (value.split('.').length > 1) {
                    len = value.split('.')[1].length;
                    v = new BigNumber(value).shiftedBy(len).toNumber();
                } else {
                    v = new BigNumber(value).toNumber();
                }
                action === 'plus' ? v++ : v > 0 ? v-- : '';
                this[params] = new BigNumber(v).shiftedBy(-len).toFixed(len, 1);
            }
        },

        // 买入 比例计算
        raleBuy(rale){
            if(Number(this.buyPrice) == 0){
                this.buyNum = 0
            }else{
                let allNumber = regular.toDividedBy(this.baseBalance,this.buyPrice,8);
                this.buyNum = regular.toBigsells([allNumber,rale],this.nowPairInfo.amount_precision) 
            }
        },

        // 卖出 比例计算
        raleSell(rale){
            if(!this.quoteBalance) this.sellNum = 0
            else this.sellNum = regular.toBigsells([this.quoteBalance,rale],this.nowPairInfo.amount_precision) 
        },

        // 买入
        buy() {
            if(!this.token()) return load.tipErrorShow('你的登录信息失效,请重新登录')
            if(!this.buyPrice) return load.tipErrorShow('请输入单价')
            else if(this.buyPrice == 0 ) return load.tipErrorShow('买入的单价应大于0')
            else if(!this.buyNum) return load.tipErrorShow('请输入数量')
            else if(Number(this.buyNum) < Number(this.nowPairInfo.min_amount) ) return this.buyTipFlag = true
            else this.buyTipFlag = false
            
            let params = {
                side: 'buy',   //  买卖方向 0-买；1-卖 ,
                salt: new Date().getTime(),   // 时间戳 
                price: Number(this.buyPrice).toString(),     //  价格 
                amount: Number(this.buyNum).toString(),    //  quote成交量 
                user: User.userId(),
                fee: 5 // 单位：万分之一
            }

            this.buyNum = null;
            if(regular.comparedTo(regular.toBigsells([params.amount,this.buyPrice],8), this.baseBalance) != 1){
                this.trade(params)
            }else{
                load.tipErrorShow('您的账户可用余额不足')
            }
        },

        // 卖出
        sell() {
            if(!this.token()) return load.tipErrorShow('你的登录信息失效,请重新登录')
            if(!this.sellPrice) return load.tipErrorShow('请输入单价')
            else if(this.sellPrice == 0) return load.tipErrorShow('卖出的单价应大于0') 
            else if(!this.sellNum) return load.tipErrorShow('请输入数量')
            else if(Number(this.sellNum) < Number(this.nowPairInfo.min_amount)) return this.sellTipFlag = true
            else this.sellTipFlag = false
            
            let params = { 
                side: 'sell',   //  买卖方向 0-买；1-卖 ,
                salt: new Date().getTime().toString(),   // 时间戳 
                price: Number(this.sellPrice).toString(),     //  价格 
                amount: Number(this.sellNum).toString(),    //  quote成交量 
                user: User.userId(),
                fee: 5  // 单位：万分之一
            }

            this.sellNum = null;
            if(regular.comparedTo(params.amount,this.quoteBalance) != 1){
                this.trade(params)
            }else{
                load.tipErrorShow('您的账户可用余额不足')
            }
        },
        // 委托下单
        trade(params){
            const success = data => {
                load.hide();
                if(data.status === 0){
                    this.getBalanceToken();
                    load.tipSuccessShow('委托成功');
                }else{
                    load.tipErrorShow(data.msg);
                }
            }

            params.version = CONFIG.version;
            params.pair = this.nowPairInfo.pair_address;
            params.expire = 0;
            params.channel = CONFIG.channel;

            const depoSig = (res) => {
                load.loadingShow();
                params.sig = xtarSign.orderSign(params,res);
                params.sig && ( this.dialogPwd = false, service.create(params).then( res => { success(res) }) )
            }
            this.regularPwd(depoSig);
        },

        // 交易确认密码
        regularPwd(FN){
            const time = xtarSign.isExpirTime();
            if(time){
                this.config = {
                    callbackSure: res => {
                        FN(res);
                    },
                    callbackCancel: () => {
                        this.dialogPwd = false;
                    }
                }
                this.dialogPwd = true
            }else FN();
                
        },
        
        toNumbers(data){
            if(!!!data) data = 0
            return Number(data)
        },

        throttle(action){
            clearInterval(this.timer);
            this.timer = setInterval(()=>{
                if(!this.token()) {
                    clearInterval(this.timer);
                    this.pubSub.resetData();
                    this.quoteBalance = this.baseBalance = 0;
                    return
                }
                this.getBalanceToken();
            },6000)
        },

        login(type){
            this.unlockFlag = type
        }
    },
    beforeDestroy(){
        clearInterval(this.timer)
    },
}
</script>

<style lang="scss" scoped>
@import '../../../lib/theme/transaction.scss';
</style>

