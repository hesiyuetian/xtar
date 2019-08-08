<template>
    <div class='sell-buy qcfd' :class="{'traditional': modeSel == 'traditional'}">
        <!-- 交易 tradType: all buy sell-->
        <div class="sell-buy-center f-fl border-box"> 
            <header class='menu qcfd'>
                <div class='item-special' :class="{'act': !isNewTrade}" @click='isNewTrade = false'>深度数据</div>
                <div class='new-special' v-if='mode' :class="{'act': isNewTrade}" @click='isNewTrade = true' >最新交易</div>
            </header>

            <template v-if='!isNewTrade'>
                <header class='head'> 
                    <span class='head-type' :class="{'acts': tradType == 'all'}" @click='changeTradType("all")'> <img src="https://beta.lyra.site/assets/images/all.svg" alt=""> </span>
                    <span class='head-type' :class="{'acts': tradType == 'sell'}" @click='changeTradType("sell")'> <img src="https://beta.lyra.site/assets/images/sell.svg" alt=""> </span>
                    <span class='head-type' :class="{'acts': tradType == 'buy'}" @click='changeTradType("buy")'> <img src="https://beta.lyra.site/assets/images/buy.svg" alt=""> </span>

                    <span class='head-item head-shen f-fr f-cursor' ref='xtarDepthSel' tabIndex="22" @blur='sleDepthFlag = false' @focus='sleDepth()'>
                        <span class='head-item-selDepth'>
                            <span>
                                {{depthVal}}
                                <i class='iconfont' :class="{'up': sleDepthFlag,'down': !sleDepthFlag}">&#xe606;</i>
                            </span>
                        </span>
                        <div v-if="sleDepthFlag" class='head-shen-dialog'>
                            <p v-for="(item,index) in sleDepthList" :key='index' class='f-cursor'
                                @click='changeDepth(item.key,item.val);$event.stopPropagation();'>{{item.val}}</p>
                        </div>
                    </span>
                </header>

                <div class='sell-buy-center-head special border-box qcfd'>
                    <div class='sell-buy-center-head-item'></div>
                    <div class='opacity sell-buy-center-head-item f-text-left'>单价 ({{nowPairInfo.pair && nowPairInfo.pair.split('_')[1]}})</div>
                    <div class='opacity sell-buy-center-head-item f-text-right'>数量 ({{nowPairInfo.pair && nowPairInfo.pair.split('_')[0]}})</div>
                    <div class='opacity sell-buy-center-head-item f-text-right'>累计 ({{nowPairInfo.pair && nowPairInfo.pair.split('_')[0]}})</div>
                </div>

                <div class='sell-buy-center-con'
                    :class="{'all': tradType == 'all', 'buy': tradType == 'buy', 'sell': tradType == 'sell'}">

                    <div class='sell-buy-center-con-sell'>
                        <div class='sell-list' v-if="deptList.sell.length > 0" >
                            <template v-for="(item,index) in deptList.sell">
                                <div class='sell-buy-center-head f-hover border-box f-cursor qcfd'  :key='index'
                                    v-if="(tradType == 'all' && (modeSel == 'traditional' ? deptList.sell.length - 14 - index <= 0 : deptList.sell.length - 20 - index <= 0)) || tradType == 'sell'" @click='setPrice(item.price)'>
                                    <div class='sell-buy-center-head-item'></div>
                                    <div class='sell-buy-center-head-item f-text-left red'>{{item.price || 0}}</div>
                                    <div class='sell-buy-center-head-item f-text-right f-opacity' :class="{'isNewBuy': item.isNew === 1, 'isNew': item.isNew === 2}">
                                        {{toFixed(item.amount,nowPairInfo.amount_precision)}}</div>
                                    <div class='sell-buy-center-head-item f-text-right'>
                                        {{toFixed(item.Accumulatives,nowPairInfo.amount_precision)}}
                                        <div class='sell-buy-center-head-flex'
                                        :style="{'width': flexDeptFt(item.amount, maxSellNum)}"></div>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <div class='f-center-y' v-if="deptList.sell.length <= 0">
                            <xtar-no-data v-if="!loadDepth" class='no-data'></xtar-no-data>
                            <xtar-load v-if="loadDepth"></xtar-load>
                        </div>
                    </div>

                    <div class='sell-buy-center-con-tip qcfd border-box' :class="{'blue': nowPairInfo.change >= 0, 'red': nowPairInfo.change < 0}">
                        <span class='f-fl'>{{toFixed(nowPairInfo.close || 0, nowPairInfo.price_precision)}}</span>
                        <span class='f-fr'>{{toFixed(nowPairInfo.change*100 || 0,2)}}%</span>
                    </div>

                    <div class='sell-buy-center-con-buy'>
                        <template v-if="deptList.buy.length > 0" >
                            <template v-for="(item,i) in deptList.buy">
                                <div class='sell-buy-center-head f-hover border-box f-cursor qcfd' :key='i'
                                    v-if="(tradType == 'all' && (modeSel == 'traditional' ? i < 14 : i < 20)) || tradType == 'buy'" @click='setPrice(item.price)'>
                                    <div class='sell-buy-center-head-item'></div>
                                    <div class='sell-buy-center-head-item f-text-left blue'>{{item.price}}</div>
                                    <div class='sell-buy-center-head-item f-text-right f-opacity' :class="{'isNewBuy': item.isNew === 1, 'isNew': item.isNew === 2}">
                                        {{toFixed(item.amount,nowPairInfo.amount_precision)}}</div>
                                    <div class='sell-buy-center-head-item f-text-right'>
                                        {{toFixed(item.Accumulatives,nowPairInfo.amount_precision)}}
                                        <div class='sell-buy-center-head-flex sell-buy-center-head-flex-buy'
                                        :style="{'width': flexDeptFt(item.amount, maxBuyNum)}"></div>
                                    </div>
                                </div>
                            </template>
                        </template>
                        <div class='f-center-y' v-if="deptList.buy.length <= 0">
                            <xtar-no-data v-if="!loadDepth" class='no-data'></xtar-no-data>
                            <xtar-load v-if="loadDepth"></xtar-load>
                        </div>
                    </div>

                </div>
            </template>

            <!-- 最新交易 -->
            <template v-if='mode'>
                <div class='new-special new-special-trad' v-if='isNewTrade'>
                    <xtar-new-trade></xtar-new-trade>
                </div>
            </template>
        </div>
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
    name: "XtarDepth",
    mixins: [ getPrecision ],
    data(){
        return {
            // 当前币对
            icon: '',

            // 是否展示最新交易
            isNewTrade: false,

            // 深度合并展示类型 弹框
            depthType: 'all',
            depthTypeList: [
                { key: 'all', val: 'direction' },
                { key: 'buy', val: 'buy' },
                { key: 'sell', val: 'sell' }
            ],
            sleDepthTypeFlag: false,

            // 买卖 详情 
            tradType: 'all',
            maxBuyNum: 0,
            maxSellNum: 0,
            // 深度合并刷选弹框
            sleDepthFlag: false,
            // 深度合并可选数列
            sleDepthList: [
                { key: 4, val: '0.0001' },
                { key: 3, val: '0.001' },
                { key: 2, val: '0.01' },
                { key: 1, val: '0.1' }
            ],
            // 深度合并选中的值
            depthVal: '0.0001',
            //深度数据
            buyTickerListData: [],
            sellTickerListData: [],
            // 深度列表
            deptList: {
                buy: [
                    // {price: 0.2121,amount: 1212,Accumulatives: 11},
                ],
                sell: []
            },
            copyDeptList: {
                buy: [
                    // {price: 0.2121,amount: 1212,Accumulatives: 11},
                ],
                sell: []
            },
            // 深度合并 精度(小数位)
            depthPrecision: 8,
            // 深度列表是否加载完成
            loadDepth: true,

            // 交叉深度
            sellCopyData: {},
            buyCopyData: {},

            // 节流开关
            throttleSwitch: true,
            // 最新价格
            tickerList: '',
            //深度滚动条延时器
            depthSetTimeOut: ''
        }
    },
    props:{
        // 界面模式  traditional ： 传统模式      tile ： 平铺模式
        modeSel: {
            type: String,
            default: 'traditional'
        },

        // 是否展示最新交易  
        mode: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        nowPairInfo(now, pre){
            if(now.pair) this.init()
        }
    },
    mounted() {
    },
    methods: {
        init() {
            Promise.all([this.resetTrad(), this.depthData()]);
        },

        //  初始化
        resetTrad(){
            this.sellCopyData = {}, this.buyCopyData = {};
            this.copyDeptList = {
                buy: [],
                sell: []
            };
            this.deptList = {
                buy: [],
                sell: []
            }
        },
        
        // 
        flexDeptFt(curry, all) {
            return `${(curry / all) * 100}%`
        },

        // 深度合并刷选
        sleDepth(type) {
            if(type === 'depthType'){
                this.sleDepthTypeFlag = !this.sleDepthTypeFlag;
            }else{
                this.sleDepthFlag = !this.sleDepthFlag;
            }
        },

        // 深度合并展示类型 选择   key,val?
        changeTradType(key,val){
            this.tradType = key;
        },

        // 计算深度合并列表
        calcDepth(num) {
            num = Number(num);
            this.depthVal = regular.exponentiatedBy(10,-num);

            this.sleDepthList.length = 0;
            for (let i = num; i >= -2; i--) {
                this.sleDepthList.length < 3 && this.sleDepthList.push({key: i, val: regular.exponentiatedBy(10,-i)});
                // this.sleDepthList.push({ key: i, val: `${i}位小数` });
            }
        },

        // 深度合并list选择  key, val?
        changeDepth(key, val) {
            console.log(this.$refs)
            if(this.$refs.xtarDepthSel) this.$refs.xtarDepthSel.blur();
            if (val) {
                this.depthVal = val;
                // this.sleDepthFlag = false; 
            }
            this.depthPrecision = key;
            let ary = JSON.parse(JSON.stringify(this.copyDeptList))
            this.deptList = {
                buy: this.depthD(this.depthMerge(ary.buy, key, 0), 0),
                sell: this.depthD(this.depthMerge(ary.sell, key, 1), 1)
            }
        },

        // 查询深度全量
        depthData() {
            const success = data => {
                if (data.status === 0) {

                    // 组装深度数据
                    data.data.buys = regular.makeDepth(data.data.buys);
                    data.data.sells = regular.makeDepth(data.data.sells);

                    this.loadDepth = false; 
                    this.buyTickerListData = data.data.buys.sort((pre, next) => {
                        return next.price - pre.price
                    });

                    this.sellTickerListData = data.data.sells.sort((pre, next) => {
                        return next.price - pre.price
                    });

                    let buy = [].concat(JSON.parse(JSON.stringify(this.buyTickerListData)));
                    let sell = [].concat(JSON.parse(JSON.stringify(this.sellTickerListData)));

                    this.copyDeptList = {
                        buy: this.depthD(buy, 0),
                        sell: this.depthD(sell, 1)
                    }

                    for (let item of this.copyDeptList.buy) {
                        this.buyCopyData[item.price] = `${item.v}-${item.amount}`;
                    }

                    for (let item of this.copyDeptList.sell) {
                        this.sellCopyData[item.price] = `${item.v}-${item.amount}`;
                    }

                    this.deptList = {
                        buy: this.depthMerge(this.copyDeptList.buy, this.nowPairInfo.price_precision, 0).sort((pre, next) => {
                            return Number(next.price) - Number(pre.price)
                        }),
                        sell: this.depthMerge(this.copyDeptList.sell, this.nowPairInfo.price_precision, 1).sort((pre, next) => {
                            return Number(next.price) - Number(pre.price)
                        })
                    }


                    // this.scoket.setDepth(this.deptList)
                    this.scrollBuyBottom()
                } else {
                    service.tipErrorShow(data.msg);
                }

            }
            service.depthData({ pair: this.nowPairInfo.pair }).then(res => success(res))
        },

        //深度 - 滚动条初始化在底部
        scrollBuyBottom() {
            clearTimeout(this.depthSetTimeOut)
            this.depthSetTimeOut = setTimeout(() => {
                document.getElementsByClassName('sell-buy-center-con-sell')[0] && document.getElementsByClassName('sell-buy-center-con-sell')[0].scrollTo(0, 99999);
            }, 100)
        },

        //深度数据-计算累计
        depthD(dataList, type) {
            let data = dataList;
            let numb = 0;
            if (type == 0) {
                for (let i of data) {
                    numb = regular.toPlus(numb,i.amount || 0);
                    i.Accumulatives = numb;
                }
            } else if (type == 1) {
                for (let i = data.length - 1; i >= 0; i--) {
                    numb = regular.toPlus(numb,data[i].amount || 0)
                    data[i].Accumulatives = numb;
                }
            }
            return data;
        },

        //ws添加深度数据
        setSdddepth(list, data) {
            let nData = [].concat(JSON.parse(JSON.stringify(list)));
            let type = true;
            let actIndex = null;
            for (let i in nData) {
                if (Number(nData[i].price) == Number(data.price)) {
                    
                    // isNew 1: 数量增加   2: 数量减少  3： 初始化
                    nData[i].isNew = data.amount > nData[i].amount ? 1 : 2;
                    nData[i].amount = data.amount;

                    if (regular.comparedTo(data.amount, '0') == 0 || Number(regular.toFixed(data.amount, this.nowPairInfo.amount_precision)) == 0) {
                        actIndex = i;
                    }
                    type = false;
                }
            }

            if (!!actIndex) {
                nData.splice(Number(actIndex), 1);
            }

            if (type) {
                data.isNew = 1;
                nData.push(data)
            }

            // nData.filter(ele => {
            // 	return !isNaN(ele.price) && !!ele.price
            // })

            return nData;
        },

        isNAN(val){
            return !isNaN(val)
        },

        // 深度合并
        depthMerge(data, level, type) {
            let newArray = [];
            let amountAry = [];
            data = JSON.parse(JSON.stringify(data))
            for (let i of data) {
                if(level >= 0) i.price = regular.toFixed(regular.fanToNum(i.price), level);
                else i.price = `${regular.toFixed(regular.fanToNum(i.price) / 10 ** -level,0)}${level == -1 ? '0' : level == -2 ? '00' : '000'}`;
            
                const findIndex = newArray.findIndex((value) => {
                    return value.price == i.price;
                })

                if (findIndex !== -1) {
                    const mergeData = newArray[findIndex];
                    i.amount = regular.toPlus(i.amount,mergeData.amount || 0);
                    newArray.splice(findIndex, 1);
                } else {
                    i.amount = i.amount
                }

                amountAry.push(i.amount);
                newArray.push(i);
            }

            if (type === 0) {
                this.maxBuyNum = Math.max(...amountAry);
            } else {
                this.maxSellNum = Math.max(...amountAry);
            }

            newArray.filter(ele => {
                return !isNaN(ele.price) && !!ele.price
            })
            return newArray
        },

        // 深度初始化动画 
        resetDepth() {
            // for (let item of this.deptList.buy) {
            // 	item.isNew = 3
            // }
            // for (let item of this.deptList.sell) {
            // 	item.isNew = 3
            // }

            for (let item of this.buyTickerListData) {
                item.isNew = 3
            }
            for (let item of this.sellTickerListData) {
                item.isNew = 3
            }
        },

        // throttled  delay: number, FN: Function
        throttled(delay, FN) {
            if (!this.throttleSwitch) return
            this.throttleSwitch = false;
            setTimeout(_ => {
                FN();
                this.throttleSwitch = true;
            }, delay)
        },

        // setTitle
        setTitle(price){
            price = regular.toFixed(this.nowPairInfo.close || 0, this.nowPairInfo.price_precision)
            document.title = `${price} ${this.icon} | XTAR`
        },
        
        setPrice(price){                       
            // this.scoket.setPrice(price)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../../lib/theme/depth.scss';
</style>

