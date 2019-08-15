<template>
    <div class="trad-content">
        <div class='trad-content-left'>
            <div class='trad-content-left-head'>
                <span class='trad-content-left-head-font' :class="{'act': chartShow == 'k'}" @click='changeChart("k")'>K线图</span>
                <span class='trad-content-left-head-font' :class="{'act': chartShow !== 'k'}" @click='changeChart("D")'>深度图</span>
                <span class="icon_start">
                    <span class='f-opacity'>{{nowPairInfo.pair && nowPairInfo.pair.replace(/_/g, '/')}}</span>
                </span>
                <span class='trad-content-left-head-all' :class="{'f-cursor': chartShow == 'k', 'f-cursor-not': chartShow != 'k'}" @click='chartShow == "k" ? onFullScreenClick($event) : "" '>
                    <img @mouseover="favSymbol(true,'fullscreenStatus')" @mouseleave="favSymbol(false,'fullscreenStatus')" :src="fullscreenStatus ? 'https://beta.lyra.site/assets/images/fullscreen_hover.svg' : 'https://beta.lyra.site/assets/images/fullscreen.svg'" alt="">
                </span>
            </div>

            <div class='trad-content-con'>
                <div class='kline' v-if="chartShow == 'k'">
                    <div class='trad-content-left-now qcfd'>
                            <div class='f-fl trad-content-left-now-left'>
                                <p class='trad-content-left-now-left-price f-opacity'>{{toFixed(nowPairInfo.close || 0 , nowPairInfo.price_precision)}}</p>
                            </div>
                            <div class='f-fl trad-content-left-now-right'>
                                <div class='trad-content-left-now-right-item'>
                                    <p class='f-opacity-t'>涨幅</p>
                                    <p class='f-opacity' :class="{'blue': nowPairInfo.change > 0, 'red': nowPairInfo.change < 0}">{{toFixed(nowPairInfo.change*100 || 0,2)}}%</p>
                                </div>
                
                                <div class='trad-content-left-now-right-item'>
                                    <p class='f-opacity-t'>最高价</p>
                                    <p class='f-opacity'>{{ toFixed(nowPairInfo.high || 0 , nowPairInfo.price_precision) }}</p>
                                </div>
                
                                <div class='trad-content-left-now-right-item'>
                                    <p class='f-opacity-t'>最低价</p>
                                    <p class='f-opacity'>{{ toFixed(nowPairInfo.low || 0 , nowPairInfo.price_precision)}}</p>
                                </div>
                
                                <div class='trad-content-left-now-right-item'>
                                    <p class='f-opacity-t'>24H成交量</p>
                                    <p class='f-opacity'>{{ toFixed(nowPairInfo.base_vol || 0 , nowPairInfo.amount_precision) }}&nbsp;({{nowPairInfo.pair && nowPairInfo.pair.split("_")[0] || '-'}})</p>
                                </div>
                            </div>
                    </div>
                    <div class='trad-content-left-headBorderBottomLine' ></div>
                    <div id="k-line"></div>
                </div>
                
                <div ref='xtarContainer' id="container" v-show="chartShow === 'D'" style="width:100%; height:100%"></div>
                <div class='container_zhan f-center' v-if="chartShow === 'D' && this.echartsList.buy.length == 0 && this.echartsList.sell.length == 0">
                    <xtar-no-data class='no-data'></xtar-no-data>
                </div>
            </div>
    
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
import { tv } from "./tradview";
import { depthUtil } from "./depth";
import { CONFIG } from '../../../utils/config';
import { watchPubSub } from "../../../watch/index";
import * as echarts from "echarts";
// import Datafeeds from '../../../../assets/trading/datafeed/udf/datafeed';
// import TradingView from '../../../../assets/trading/charting_library.min.js';

// import Datafeeds from '../../../../static/trading/datafeed/udf/datafeed';
// import TradingView from '../../../../static/trading/charting_library.min.js';

export default {
    name: "XtarKLine",
    mixins: [ getPrecision ],
    data(){
        return {
            // left K-line AND depth

            // 主题色是否是深色
            isDark: "Light",
            //节流开关
            throttleSwitch: true,
            //K线深度切换开关 默认K线图
            chartShow: 'k',

            // 当前的币种
            symbol: '',

            //K线图对象
            widget: null,
            //k线图默认时间的显示
            cycle: (!User.getItem('tradingview.resolution') || User.getItem('tradingview.resolution') < 5) ? '5' : User.getItem('tradingview.resolution'),
            timezone: regular.getTimeZone(),


            // 深度图开始
            depth: null,
            depthDataS: null,
            initDepthFlag: true,
            // erach
            echartsList: {
                buy: [
                    // { 'quantity': 6000.00000000, 'price': 6004.0 },
                ],
                sell: [ ]
            },
            // 交叉深度
            sellCopyData: {},
            buyCopyData: {},
            //备份深度数据
            buyTickerListData: [],
            sellTickerListData: [],

            // 按钮操作
            fullscreenStatus: false,
        }
    },
    watch: {
        nowPairInfo(now, pre){
            if(now.pair) this.init()
        }
    },
    props: {
        src: {
            type: String,
        },
        tradingView: null,
        datafeeds: null
    },
    mounted() {
        watchPubSub.scoket( res => {
            if (res.type === 'depth') {
				if (res.result.action == 'update') {
                    let _buy = res.result.data.buys, _sell = res.result.data.sells;

					// 卖    大
					for (let item of _sell) {
						if (!this.sellCopyData[regular.toFixed(item.price, 8)] || (this.sellCopyData[regular.toFixed(item.price, 8)]) < item.v) {
							this.sellCopyData[regular.toFixed(item.price, 8)] = item.v

							// 处理交叉数据
							const findBuy = this.buyTickerListData.filter((ele) => {
								return Number(ele.price) >= Number(item.price)
							})
							for (let val of findBuy) {
								let index = this.buyTickerListData.findIndex((ele) => {
									return Number(ele.price) == Number(val.price)
								})
								this.buyTickerListData[index].amount = 0;
							}
                            
							this.sellTickerListData = this.setSdddepth(this.sellTickerListData, item);
						}
					}

					// 买    小
					for (let item of _buy) {
						if(!this.buyCopyData[regular.toFixed(item.price, 8)] || (this.buyCopyData[regular.toFixed(item.price, 8)]) < item.v) {

							this.buyCopyData[regular.toFixed(item.price,8)] = item.v;

							// 处理交叉数据
							if(item.amount > 0){
								const findSell = this.sellTickerListData.filter((ele) => {
									return Number(ele.price) < Number(item.price)
								})
								for (let val of findSell) {
									let index = this.sellTickerListData.findIndex((ele) => {
										return Number(ele.price) == Number(val.price)
									})
									this.sellTickerListData[index].amount = 0;
								}
							}
							
							this.buyTickerListData = this.setSdddepth(this.buyTickerListData, item);
						}
                    }
                    
                    this.echartsList.sell = this.sellTickerListData = this.sellTickerListData.filter((ele) => {
                        return Number(regular.toFixed(ele.amount, this.nowPairInfo.amount_precision)) != 0 && !!ele.price
                    });

                    this.echartsList.buy = this.buyTickerListData = this.buyTickerListData.filter((ele) => {
                        return Number(regular.toFixed(ele.amount, this.nowPairInfo.amount_precision)) != 0 && !!ele.price
                    })

                    if(this.chartShow === "D") this.throttled(1000)
				}
			} 
        })
    },
    methods: {
        init() {
            setTimeout(_ => {
                this.initKLine();
                this.initDept();
            }, 500)
        },

        /**
         * 
         * @@@  left  K-line AND depth
         * 
         */

        // K线深度切换
        changeChart(val) {
            this.chartShow = val;
            setTimeout(_ => {
                if (val == 'k') this.initKLine();
                else this.depth.resize(), this.getDepth();
            }, 500)
        },

        /**
         * @@@@ K线绘制 
         */
        
        //全屏
        onFullScreenClick(e) {
            var k_lineIframe = $("#k-line iframe").attr("id");
            tv.launchFullScreen(document.getElementById(k_lineIframe));
        },

        //初始化K线图
        initKLine() {
            let self = this;
            var widget = this.widget = new window.TradingView.widget({
                fullscreen: false,
                theme: 'Dark',
                style: 3,
                symbol: self.nowPairInfo.pair,
                custom_css_url: './light.css',
                timezone: this.timezone,
                withdateranges: true,

                // 默认显示时间间隔的数据
                interval: this.cycle,
                timeframe: this.cycle,
                
                container_id: "k-line",
                datafeed: new window.Datafeeds.UDFCompatibleDatafeed(`${CONFIG.apiUrl}/v1/market`,3000000000),
                library_path: this.src,
                // library_path: "https://images.lyra.site/static/trading/",
                // library_path: this.src,
                locale: User.getItem('language') || "zh", // en
                // 不显示元素
                disabled_features: tv.getDisFeatures(),
                favorites: {
                    intervals: ['1', '5', '15', '30', '60', '120', '240', '360', 'D', 'W', 'M'],
                    chartTypes: ['Area']
                },
                // kx
                // 显示元素
                enabled_features: tv.getEnFeature(),
                preset: "mobile",
                charts_storage_api_version: '1.1',
                client_id: 'tradingview.com',
                user_id: 'public_user_id',

                // 工具栏背景色
                // toolbar_bg: '#ff0',
                autosize: true,//自适应
                time_frames: [],//左侧底部时间格式化
                overrides: tv.getOverrides(this.isDark).dark_overrides,
                studies_overrides: tv.getOverrides(this.isDark).dark_studies_overrides,
                allow_symbol_change: true,
                
            });
            // setTimeout(()=>{
            //     let parentDomain = window.location.hostname;
            //     console.log("domain",parentDomain); //localhost
            //     document.domain = 'images.lyra.site';
            // },1000)
            

            var chartType = 1;
            this.widget.onChartReady(() => {
                //设置均线种类 均线样式
                tv.createStudy(this.widget);
                //生成时间按钮
                tv.createButton(this.widget, this);
                this.widget.chart().setChartType(chartType);
            });

            this.widget = widget;
        },
        

        /**
         * @@@  earchs 绘制步骤
         *  */

        // earch dom
        initDept() {
            const domContainer = this.$refs.xtarContainer;
            if(this.depth){
                this.depth.clear();
            }
            this.depth = echarts.init(domContainer);
            
        },

        // 初始化depth数据
        getDepth(){
            if(!this.initDepthFlag) return depthUtil.getDepthChartData(this.echartsList, regular, this)
            
            const success = data => {
                if (data.status === 0) {
                    this.initDepthFlag = false;
                    this.echartsList = {
                        buy: regular.makeDepth(data.data.buys),
                        sell: regular.makeDepth(data.data.sells),
                    }

                    this.buyTickerListData = this.echartsList.buy;
                    this.sellTickerListData = this.echartsList.sell;

                    for (let item of this.echartsList.buy) {
                        this.buyCopyData[item.price] = item.v;
                    }

                    for (let item of this.echartsList.sell) {
                        this.sellCopyData[item.price] = item.v;
                    }

                    depthUtil.getDepthChartData(this.echartsList, regular, this)
                }
            }
            service.depthData({ pair: this.nowPairInfo.pair }).then(res => success(res))
        },

        //ws添加深度数据
        setSdddepth(list, data) {
            let nData = [].concat(JSON.parse(JSON.stringify(list)));
            let type = true;
            let actIndex = null;
            for (let i in nData) {
                if (Number(nData[i].price) == Number(data.price)) {
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
            return nData;
        },
        
        // 深度图 设置 函数节流  delay: number, action: Function
        throttled(delay){
            if (!this.throttleSwitch) {
                return;
            }
            this.throttleSwitch = false;
            setTimeout(() => {
                depthUtil.getDepthChartData(this.echartsList, regular, this)
                this.throttleSwitch = true;
            }, delay);
        },
        

        //k线上边的交易对收藏图标：hover效果
        favSymbol(status,type){
            this[type] = status;
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../../../lib/theme/kline.scss';
</style>

