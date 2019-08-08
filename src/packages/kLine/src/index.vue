<template>
    <div class="trad-content">
        <div class='trad-content-left'>
            <div class='trad-content-left-head'>
                <span class='trad-content-left-head-font' :class="{'act': chartShow == 'k'}" @click='changeChart("k")'>K线图</span>
                <span class='trad-content-left-head-font' :class="{'act': chartShow !== 'k'}" @click='changeChart("")'>深度图</span>
                <span class="icon_start">
                    <span class='f-opacity'>{{nowPairInfo.pair && nowPairInfo.pair.replace(/_/g, '/')}}</span>
                </span>
                <span class='trad-content-left-head-all' :class="{'f-cursor': chartShow == 'k', 'f-cursor-not': chartShow != 'k'}" @click='chartShow == "k" ? onFullScreenClick($event) : "" '>
                    <img @mouseover="favSymbol(true,'fullscreenStatus')" @mouseleave="favSymbol(false,'fullscreenStatus')" v-if="isDark === 'Light'" :src="fullscreenStatus ? 'https://beta.lyra.site/assets/images/fullscreen_hover.svg' : 'https://beta.lyra.site/assets/images/fullscreen.svg'" alt="">
                    <img @mouseover="favSymbol(true,'fullscreenStatus')" @mouseleave="favSymbol(false,'fullscreenStatus')" v-if="isDark === 'Dark'" :src="fullscreenStatus ? 'https://beta.lyra.site/assets/images/fullscreen_hover.svg' : 'https://beta.lyra.site/assets/images/fullscreen-d.svg'" alt="">
                </span>
            </div>

            <div class='trad-content-con'  :class="{'model': modeSel === 'tile'}">
                <div class='kline' v-if="chartShow == 'k'">
                    <div class='trad-content-left-now qcfd' v-if="modeSel === 'traditional'">
                            <div class='f-fl trad-content-left-now-left'>
                                <p class='trad-content-left-now-left-price f-opacity'>{{toFixed(nowPairInfo.close || 0 , precision.pricePrecision)}}</p>
                            </div>
                            <div class='f-fl trad-content-left-now-right'>
                                <div class='trad-content-left-now-right-item'>
                                    <p class='f-opacity-t'>涨幅</p>
                                    <p class='f-opacity' :class="{'blue': nowPairInfo.change > 0, 'red': nowPairInfo.change < 0}">{{toFixed(nowPairInfo.change*100 || 0,2)}}%</p>
                                </div>
                
                                <div class='trad-content-left-now-right-item'>
                                    <p class='f-opacity-t'>最高价</p>
                                    <p class='f-opacity'>{{ toFixed(nowPairInfo.high || 0 , precision.pricePrecision) }}</p>
                                </div>
                
                                <div class='trad-content-left-now-right-item'>
                                    <p class='f-opacity-t'>最低价</p>
                                    <p class='f-opacity'>{{ toFixed(nowPairInfo.low || 0 , precision.pricePrecision)}}</p>
                                </div>
                
                                <div class='trad-content-left-now-right-item'>
                                    <p class='f-opacity-t'>24H成交量</p>
                                    <p class='f-opacity'>{{ toFixed(nowPairInfo.base_vol || 0 , precision.amountPrecision) }}&nbsp;({{nowPairInfo.pair && nowPairInfo.pair.split("_")[0] || '-'}})</p>
                                </div>
                            </div>
                    </div>
                    <div v-if="modeSel === 'tile'" class='model-left model-icon' @click='changeDire("leftDirec",leftDirec)'>
                        <i v-if="leftDirec" class='iconfont'>&#xe836;</i>
                        <i v-if="!leftDirec" class='iconfont'>&#xe837;</i>
                    </div>
                    <div class='trad-content-left-headBorderBottomLine' ></div>
                    <div id="k-line"></div>
                </div>
                
                <div id="container" v-if="chartShow !== 'k'" style="width:100%;height:500px"></div>
        
                <div class='container_zhan f-center' v-if="chartShow !== 'k' && this.echartsList.buy.length == 0 && this.echartsList.sell.length == 0">
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
import { CONFIG } from '../../../utils/config';
import Datafeeds from '../../../lib/trading/datafeed/udf/datafeed';
import TradingView from '../../../lib/trading/charting_library.min.js';
export default {
    name: "XtarKLine",
    mixins: [ getPrecision ],
    data(){
        return {
            modeSel: 'traditional',
            
            precision: {
                amountPrecision: 4,
                basePrecision: 4,
                pricePrecision: 4,
                minSize: 1
            },


            // left K-line AND depth

            // 主题色是否是深色
            isDark: false,
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
            // erach
            echartsList: {
                buy: [
                    // { 'quantity': 6000.00000000, 'price': 6004.0 },
                ],
                sell: [

                ]
            },
            
            // 按钮操作
            fullscreenStatus: false,
        }
    },
    watch: {
        nowPairInfo(now, pre){
            if(now.pair){
                this.init()
            } 
        }
    },
    methods: {
        init() {
            setTimeout(_ => {
                this.initKLine();
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
                else this.initDept();
            }, 500)
        },

        /**
         * @@@@ K线绘制 
         */
        
        //改变图表皮肤
        changeChartTheme(theme) {
            //K线图
            this.widget.onChartReady(() => {
                if (this.isDark === 'Dark') {
                    this.widget.addCustomCSSFile('./chart.css');
                } else {
                    this.widget.addCustomCSSFile('./light.css');
                }
                this.widget.applyOverrides(this.getOverrides(theme).dark_overrides)
                this.widget.applyStudiesOverrides(this.getOverrides(theme).dark_studies_overrides)
            });
        },


        //全屏
        onFullScreenClick(e) {
            var k_lineIframe = $("#k-line iframe").attr("id");
            this.launchFullScreen(document.getElementById(k_lineIframe));
        },

        //K线图全屏
        launchFullScreen(element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        },

        changeLanguage(){
            this.widget && this.chartShow == 'k' && this.initKLine();
        },

        // k线主题样式
        getOverrides(theme){
            var themes = {
                "Light": {
                    areatop: "rgba(71, 78, 112, 0.1)",
                    areadown: "rgba(71, 78, 112, 0.02)",
                    areaLine: "rgba(71, 78, 112, 0.5)",
                    volumeSell: "rgba(255,111,121,1)",
                    volumeBuy: "rgba(0,195,179,1)",
                    background: "#fff",
                    candleStyleUpColor: '#4181FF',
                    verColor: 'rgba(18, 25, 50,.05)',
                    horColor: 'rgba(18, 25, 50,.05)',
                    textColor: "rgba(18, 25, 50,.2)",
                    lineColor: 'rgba(18, 25, 50,.1)',
                    crossHairColor: 'rgba(18, 25, 50,.2)'
                },

                "Dark": {
                    areatop: "rgba(249,241,241, 0.1)",
                    areadown: "rgba(249,241,241, 0.02)",
                    areaLine: "rgba(249,241,241, 0.5)",
                    volumeSell: "rgba(255,111,121,1)",
                    volumeBuy: "rgba(0,195,179,1)",
                    background: "#1C2439",
                    candleStyleUpColor: '#4181FF',
                    verColor: 'rgba(49,58,83,.05)',
                    horColor: 'rgba(49,58,83,.05)',
                    textColor: "rgba(255, 255, 255,.2)",
                    lineColor: 'rgba(49,58,83,.1)',
                    crossHairColor: 'rgba(255, 255, 255,.2)'
                }
            };
            var t = themes[theme];
            
            return {
                'dark_studies_overrides': {
                    "volume.volume.color.0": t.volumeSell,
                    "volume.volume.color.1": t.volumeBuy,
                    "volume.volume.transparency": 12,
                    "MA Cross.short:plot.color": "#ff0",
                    "MA Cross.long:plot.color": "#000",
                }, 

                // 更改蜡烛图显示
                'dark_overrides': {

                    'scalesProperties.showLeftScale': false,
                    "volumePaneSize": "medium",
                    
                    "paneProperties.background": t.background,

                    // 面积图
                    "mainSeriesProperties.areaStyle.color1": t.areatop,
                    "mainSeriesProperties.areaStyle.color2": t.areadown,
                    "mainSeriesProperties.areaStyle.linecolor": t.areaLine,
                    "mainSeriesProperties.areaStyle.linewidth": 1,
                    "mainSeriesProperties.areaStyle.priceSource": "close",

                    // 网格
                    'paneProperties.vertGridProperties.style': 0,
                    'paneProperties.horzGridProperties.style': 0,
                    "paneProperties.vertGridProperties.color": t.verColor,
                    "paneProperties.horzGridProperties.color": t.horColor,

                    // 坐标轴和刻度标签颜色
                    "scalesProperties.textColor": t.textColor, //标注的字体色
                    "paneProperties.legendProperties.showLegend": false,
                    "scalesProperties.lineColor": t.lineColor,//刻度线颜色
                    //'paneProperties.topMargin': 20,

                    "mainSeriesProperties.candleStyle.downColor": t.volumeSell,  // K线 sell颜色
                    'mainSeriesProperties.candleStyle.upColor': t.volumeBuy, // K线 buy颜色
                    "mainSeriesProperties.candleStyle.drawWick": true,
                    "mainSeriesProperties.candleStyle.drawBorder": true,
                    "mainSeriesProperties.candleStyle.borderUpColor": t.volumeBuy,
                    "mainSeriesProperties.candleStyle.borderDownColor": t.volumeSell,

                    // 烛心颜色
                    "mainSeriesProperties.candleStyle.wickUpColor": t.volumeBuy,
                    "mainSeriesProperties.candleStyle.wickDownColor": t.volumeSell,

                    "mainSeriesProperties.candleStyle.barColorsOnPrevClose": false, //

                    'paneProperties.crossHairProperties.color': t.crossHairColor, // 十字线颜色.

                    "paneProperties.legendProperties.showStudyArguments": true,
                    "paneProperties.legendProperties.showStudyTitles": true,
                    "paneProperties.legendProperties.showStudyValues": true,
                    "paneProperties.legendProperties.showSeriesTitle": true,
                    "paneProperties.legendProperties.showSeriesOHLC": true,
                    "mainSeriesProperties.candleStyle.borderColor": "#4e5b85",
                    "mainSeriesProperties.hollowCandleStyle.upColor": "#589065",
                    "mainSeriesProperties.hollowCandleStyle.downColor": "#ae4e54",
                    "mainSeriesProperties.hollowCandleStyle.drawWick": true,
                    "mainSeriesProperties.hollowCandleStyle.drawBorder": true,
                    "mainSeriesProperties.hollowCandleStyle.borderColor": "#4e5b85",
                    "mainSeriesProperties.hollowCandleStyle.borderUpColor": "#589065",
                    "mainSeriesProperties.hollowCandleStyle.borderDownColor": "#ae4e54",
                    "mainSeriesProperties.haStyle.upColor": "#589065",
                    "mainSeriesProperties.haStyle.downColor": "#ae4e54",
                    "mainSeriesProperties.haStyle.drawWick": true,
                    "mainSeriesProperties.haStyle.drawBorder": true,
                    "mainSeriesProperties.haStyle.borderColor": "#4e5b85",
                    "mainSeriesProperties.haStyle.borderUpColor": "#589065",
                    "mainSeriesProperties.haStyle.borderDownColor": "#ae4e54",
                    "mainSeriesProperties.haStyle.wickColor": "#4e5b85",
                    "mainSeriesProperties.haStyle.barColorsOnPrevClose": false,
                    "mainSeriesProperties.barStyle.upColor": "#589065",
                    "mainSeriesProperties.barStyle.downColor": "#ae4e54",
                    "mainSeriesProperties.barStyle.barColorsOnPrevClose": false,
                    "mainSeriesProperties.barStyle.dontDrawOpen": false,
                    "mainSeriesProperties.lineStyle.color": "#4e5b85",
                    "mainSeriesProperties.lineStyle.linewidth": 1,
                    "mainSeriesProperties.lineStyle.priceSource": "close",

                    "mainSeriesProperties.style": 1,
                    "mainSeriesProperties.showPriceLine": true,
                    "symbolWatermarkProperties.transparency": 100,
                    "TradingView.PaneRendererColumns": 1,
                    "scalesProperties.showSeriesLastValue": true,//当前价
                    "scalesProperties.showRightScale": true,

                }
            }
        },

        //初始化K线图
        initKLine() {
            let self = this;
            var widget = this.widget = new TradingView.widget({
                fullscreen: false,
                theme: 'Dark',
                style: 3,
                symbol: self.nowPairInfo.pair,
                // symbol: "AAPL",
                custom_css_url: this.isDark === 'Dark' ? './chart.css' :'./light.css',
                timezone: this.timezone,
                // exchange: 'Lydr Exchange',
                withdateranges: true,

                // 默认显示时间间隔的数据
                interval: this.cycle,
                timeframe: this.cycle,
                
                container_id: "k-line",
                // datafeed: new Datafeeds.UDFCompatibleDatafeed('https://demo_feed.tradingview.com',4000),
                datafeed: new Datafeeds.UDFCompatibleDatafeed(`${CONFIG.apiUrl}/v1/market`,3000),
                library_path: "assets/trading/",
                locale: User.getItem('language') || "zh", // en
                // drawings_access: { type: 'black', tools: [{ name: "Regression Trend" }] },
                // 不显示元素
                disabled_features: this.getDisFeatures(),
                favorites: {
                    intervals: ['1', '5', '15', '30', '60', '120', '240', '360', 'D', 'W', 'M'],
                    chartTypes: ['Area']
                },
                // kx
                // 显示元素
                enabled_features: this.getEnFeature(),
                preset: "mobile",
                charts_storage_api_version: '1.1',
                client_id: 'tradingview.com',
                user_id: 'public_user_id',

                // 工具栏背景色
                // toolbar_bg: '#ff0',
                autosize: true,//自适应
                time_frames: [],//左侧底部时间格式化
                overrides: this.getOverrides(this.isDark).dark_overrides,
                studies_overrides: this.getOverrides(this.isDark).dark_studies_overrides,
                allow_symbol_change: true,
                
            });

            var chartType = 1, _this=this;
            this.widget.onChartReady(function () {
                //设置均线种类 均线样式
                _this.createStudy();
                //生成时间按钮
                _this.createButton();
                _this.widget.chart().setChartType(chartType);
                // toggleStudy(chartType);
            });

            this.widget = widget;
        },

        // 创建均线
        createStudy(){
            this.widget.chart().createStudy('Moving Average', false, false, [5], null, { 'Plot.color': 'rgb(150, 95, 196)' });
            this.widget.chart().createStudy('Moving Average', false, false, [10], null, { 'Plot.color': 'rgb(116,149,187)' });
            this.widget.chart().createStudy('Moving Average', false, false, [20], null, { "plot.color": "rgb(58,113,74)" });
            this.widget.chart().createStudy('Moving Average', false, false, [30], null, { "plot.color": "rgb(118,32,99)" });
        },

        // 创建tradingView
        createButton(){
            var thats = this.widget, _this = this;

            var buttons = [
                { title: "分时", resolution: '1', chartType: 3 },
                { title: "1分", resolution: '1', chartType: 1 },
                { title: "3分", resolution: '3', chartType: 1 },
                { title: "5分", resolution: '5', chartType: 1 },
                { title: "15分", resolution: '15', chartType: 1 },
                { title: "30分", resolution: '30', chartType: 1 },
                { title: "1小时", resolution: '60', chartType: 1 },
                { title: "1天", resolution: 'D', chartType: 1 },
                { title: "1周", resolution: 'W', chartType: 1 },
                { title: "1月", resolution: 'M', chartType: 1 },
            ];
            var resolution = this.cycle, chartType = 1;

            for (var i = 0; i < buttons.length; i++) {
                (function (button) {
                    thats.createButton()
                        .attr('title', button.title).addClass("mydate")
                        .text(button.title)
                        .on('click', function (e) {
                            if ($(this).parent().hasClass('active')) {
                                return false;
                            }
                            localStorage.setItem('tradingview.resolution', button.resolution);
                            localStorage.setItem('tradingview.chartType', button.chartType);
                            $(this).parent().addClass('active').siblings('.active').removeClass('active');
                            thats.chart().setResolution(button.resolution, function onReadyCallback() { });
                            if (button.chartType != thats.chart().chartType()) {
                                thats.chart().setChartType(button.chartType);
                                toggleStudy(button.chartType);
                            }
                        }).parent().addClass('my-group' + (button.resolution == resolution && button.chartType == chartType ? ' active' : ''));
                })(buttons[i]);
            }
        
            function toggleStudy(chartType) {
                if (chartType == 3) {
                    for (let item of _this.widget.chart().getAllStudies()) {
                        if (item.name === 'Moving Average') {
                            _this.widget.chart().removeEntity(item.id)
                        }
                    }
                } else {
                    _this.createStudy();
                }
            }
        },

        /**
         *  配置不显示元素
         */
        getDisFeatures() {
            return [
                'volume_force_overlay',
                'header_undo_redo',
                'header_symbol_search',
                'go_to_date',
                'header_compare',
                // 全屏
                'header_fullscreen_button',
                'use_localstorage_for_settings',
                // 设置图标
                'header_settings',
                // 照相机
                'header_screenshot',
            ];
        },

        /**
         *  配置显示元素
         */
        getEnFeature() {
            return [
                //  图表类型
                'header_chart_type',
                //  logo位置上移
                // 'move_logo_to_main_pane',
                'header_resolutions',

                'adaptive_logo',
                'left_toolbar',
                'hide_left_toolbar_by_default',
                'header_widget',
                'dont_show_boolean_study_arguments',
                'hide_last_na_study_output',
                'same_data_requery',
                'side_toolbar_in_fullscreen_mode',

                'disable_resolution_rebuild',
                "use_localstorage_for_settings",
                "remove_library_container_border",
                "save_chart_properties_to_local_storage",
                "constraint_dialogs_movement",
            ];
        },

        /**
         * @@@  earchs 绘制步骤
         *  */

        // earch dom
        initDept() {
            const domContainer = this.renderer.selectRootElement('#container');
            this.depth = echarts.init(domContainer);
            this.getDepthChartData();
        },

        // earch **** 初始化
        getDepthChartData() {
            if (this.echartsList.buy[0] || this.echartsList.sell[0]) {
                this.depthDataS = this.formatterDepth(this.echartsList);
                this.setOption(this.depthDataS);
            }
        },

        formatterDepth(res) {

            const bids = res.buy.sort(new SortPipe().transform('price', true));
            const asks = res.sell.sort(new SortPipe().transform('price', false));

            let bidsTotal = 0;
            let asksTotal = 0;
            let maxBuyPrice = 0;
            let minBuyPrice = 0;
            let maxSellPrice = 0;
            let minSellPrice = 0;
            let buyAmounts = [];
            let sellAmounts = [];
            let buyPrices = [];
            let sellPrices = [];
            let amounts = [];
            let prices = [];
            let datas = [];
            if (Array.isArray(bids) && bids.length > 0) {
                datas = [];
                datas = bids.slice(0, 50);
                amounts = [];
                prices = [];
                for (const buyData of datas) {

                    bidsTotal = Number(bidsTotal) + Number(buyData.amount);

                    amounts.push(bidsTotal);
                    prices.push(buyData.price);
                }
                maxBuyPrice = Math.max.apply(null, prices);
                minBuyPrice = Math.min.apply(null, prices);
                buyAmounts = amounts;
                buyPrices = prices;
            }
            if (Array.isArray(asks) && asks.length > 0) {
                datas = [];
                datas = asks.slice(0, 50);
                amounts = [];
                prices = [];
                for (const sellData of datas) {
                    asksTotal = Number(asksTotal) + Number(sellData.amount);
                    amounts.push(asksTotal);
                    prices.push(sellData.price);
                }
                maxSellPrice = Math.max.apply(null, prices);
                minSellPrice = Math.min.apply(null, prices);
                sellAmounts = amounts;
                sellPrices = prices;
            }
            const priceGap = Number(maxSellPrice) - Number(minBuyPrice);
            const buyPriceGap = Number(maxBuyPrice) - Number(minBuyPrice);
            const sellPriceGap = Number(maxSellPrice) - Number(minSellPrice);
            let buyPercent = buyPriceGap / priceGap;

            if (buyPercent >= 0.75) {
                buyPercent = 0.65;
            }
            if (buyPercent < 0.25) {
                buyPercent = 0.25;
            }

            let sellPercent = sellPriceGap / priceGap;
            if (sellPercent >= 0.75) {
                sellPercent = 0.65;
            }
            if (sellPercent < 0.25) {
                sellPercent = 0.25;
            }
            const maxAmount = Math.max(bidsTotal, asksTotal) || 10;
            return {
                maxAmount,
                maxBuyPrice,
                minBuyPrice,
                maxSellPrice,
                minSellPrice,
                buyAmounts,
                buyPrices,
                sellPrices,
                sellAmounts,
                buyPercent,
                sellPercent
            };
        },

        // earch 绘制
        setOption(data) {
            this.depth.setOption({
                // 深度图背景色
                backgroundColor: this.isDark === 'Dark' ? '#1C2439' : '#FFFFFF',
                animation: true,
                axisPointer: {
                    link: {
                        // yAxisIndex: [0, 1]
                    },
                    label: {
                        // backgroundColor: "#777"
                    }
                },
                grid: this.getGrid(data),
                tooltip: this.getToolTip(data),
                yAxis: this.getYAxis(data),
                xAxis: this.getXAxis(data),
                series: this.getSeries(data)
            }, true);
            window.onresize = this.depth.resize;
        },

        // 深度图 设置 函数节流  delay: number, action: Function
        throttled(delay, action) {
            if (!this.throttleSwitch) {
                return;
            }
            this.throttleSwitch = false;
            setTimeout(() => {
                action();
                this.throttleSwitch = true;
            }, delay);
        },

        getGrid(data) {
            return [
                {
                    bottom: 20,
                    left: '52%',
                    height: '85%',
                    right: 0,
                    width: '48%'
                },
                {
                    bottom: 20,
                    left: '0%',
                    right: 0,
                    height: '85%',
                    width: '48%'
                }
            ];
        },

        getYAxis(data) {
            return [
                {
                    show: false,
                    type: 'value',
                    gridIndex: 0,
                    scale: true,
                    position: 'right',
                    min: 0,
                    minInterval: 'auto',
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            // 坐标轴颜色
                            color: '#4E5474'
                        }
                    },
                    splitArea: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    // 辅助线
                    axisPointer: {
                        show: false,
                        lineStyle: {
                            color: '#2A2C35',
                            type: 'dotted'
                        }
                    },
                    axisTick: {
                        show: true
                    },
                    axisLabel: {
                        show: true,
                        inside: false
                        // color: 'red'
                    },
                    max: data.maxAmount
                },
                {
                    show: false,
                    position: 'left',
                    type: 'value',
                    gridIndex: 1,
                    scale: true,
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            // 坐标轴颜色
                            color: '#c2c2c2'
                        }
                    },
                    // 辅助线
                    axisPointer: {
                        show: false,
                        lineStyle: {
                            color: '#2A2C35',
                            type: 'dotted'
                        }
                    },
                    splitArea: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    min: 0,
                    max: data.maxAmount
                }
            ];
        },

        getXAxis(data) {
            return [
                {
                    show: true,
                    type: 'category',
                    gridIndex: 0,
                    data: data.sellPrices,
                    boundaryGap: false,
                    splitArea: {
                        show: false
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: '#AE3D42',
                            type: 'dotted'
                        }
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: 'none'
                        }
                    },
                    // 辅助线
                    axisPointer: {
                        // show: false,
                        lineStyle: {
                            color: '#2A2C35',
                            type: 'dotted'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        margin: 8,
                        showMinLabel: true,
                        showMaxLabel: true,
                        interval: 'auto',
                        // 价格字体颜色
                        color: '#c2c2c2',
                        fontSize: 10,
                        verticalAlign: 'middle',
                        textStyle: {
                            align: 'left'
                        }
                    }
                },
                {
                    show: true,
                    type: 'category',
                    gridIndex: 1,
                    data: data.buyPrices,
                    boundaryGap: false,
                    splitArea: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#37404b',
                            type: 'dotted'
                        }
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: 'none'
                        }
                    },
                    // 辅助线
                    axisPointer: {
                        // show: false,
                        lineStyle: {
                            color: '#2A2C35',
                            type: 'dotted'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    inverse: true,
                    axisLabel: {
                        show: true,
                        margin: 8,
                        showMinLabel: true,
                        showMaxLabel: true,
                        interval: 'auto',
                        color: '#c2c2c2',
                        fontSize: 10,
                        verticalAlign: 'middle',
                        textStyle: {
                            align: 'right'
                        }
                    }
                }
            ];
        },

        getSeries(data) {
            return [
                {
                    name: 'sell',
                    type: 'line',
                    areaStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: 'rgba(255,111,121,.2)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(255,111,121,.2)'
                                    }
                                ]
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#28b869'
                        }
                    },
                    step: 'end',
                    data: data.sellAmounts,
                    smooth: false,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            width: 1,
                            color: 'rgba(255,111,121,.5)',
                            opacity: 9
                        }
                    },
                    xAxisIndex: 0,
                    yAxisIndex: 0
                },
                {
                    name: 'buy',
                    type: 'line',
                    areaStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: 'rgba(0,195,179,.2)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(0,195,179,.2)'
                                    }
                                ]
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#ee4a4a'
                        }
                    },
                    step: 'end',
                    data: data.buyAmounts,
                    smooth: false,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            width: 1,
                            color: 'rgba(0,195,179,.5)',
                            opacity: 9
                        }
                    },
                    xAxisIndex: 1,
                    yAxisIndex: 1
                }
            ];
        },

        getToolTip(data) {
            const self = this;
            return {
                trigger: 'axis',
                animation: false,
                axisPointer: {
                    type: 'cross',
                    link: { xAxisIndex: 'all' }
                },
                backgroundColor: 'rgba(245, 245, 245, 0.5)',
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                textStyle: {
                    color: this.isDark ? '#fff' : '#002257'
                },
                extraCssText: 'background:#252332;border:0;color:#ffffff;opacity: 0.7;font-size:12px;',
                formatter: function (param) {
                    param = param[0];
                    if (param.seriesName === 'sell') {
                        return [
                            '<div style="text-align:left">',
                            '<div style="width:6px;height:6px;background:#AE3D42;border-radius:4px;' +
                            'float:left;margin-top:8px;margin-right:2px;"></div>' +
                            `${self.user.getItem('language') === 'zh' ? '卖出价格: ' : 'Sell price: '}` +
                            new BigNumber(param.axisValue).toFixed(self.precision.pricePrecision) +
                            '<br/>',
                            '<div style="width:10px;height:6px;background:#AE3D42;border-radius:4px;' +
                            'float:left;margin-top:8px;margin-right:2px;"></div>' +
                            `${self.user.getItem('language') === 'zh' ? '卖出累计: ' : 'Sell ​​cumulative: '}` +
                            new BigNumber(param.data).toFixed(self.precision.amountPrecision) +
                            '<br/>',
                            '</div>'
                        ].join('');
                    } else if (param.seriesName === 'buy') {
                        return [
                            '<div style="text-align:left">',
                            '<div style="width:6px;height:6px;background:#38BC74;border-radius:4px;' +
                            '       float:left;margin-top:8px;margin-right:2px;"></div>' +
                            `${self.user.getItem('language') === 'zh' ? '买入价格: ' : 'Buy price: '}` +
                            new BigNumber(param.axisValue).toFixed(self.precision.pricePrecision) +
                            '<br/>',
                            '<div style="width:10px;height:6px;background:#38BC74;border-radius:4px;' +
                            'float:left;margin-top:8px;margin-right:2px;"></div>' +
                            `${self.user.getItem('language') === 'zh' ? '买入累计: ' : 'Buy cumulative: '}` +
                            new BigNumber(param.data).toFixed(self.precision.amountPrecision) +
                            '<br/>',
                            '</div>'
                        ].join('');
                    }
                }
            }
        },

        unLogin() {
            const config = {
                tip: this.translate.instant('common.unLogin'),
                tipKey: this.translate.instant('common.unLoginTip'),
                ok: this.translate.instant('Header.login'),
                callbackSure: () => {
                    this.router.navigateByUrl(`/user/login?forward=/trade/${this.symbol}`)
                },
                callbackCancel: () => { },
            }
            this.dialog.createFromComponent(ConterAlertComponent, config)
        },

        //k线上边的交易对收藏图标：hover效果
        favSymbol(status,type){
            this[type] = status;
        },

        changeDire(type,direc){
            this[type] = !direc;
            this.scoket.setTileDirection({
                type: type,
                direc: direc
            })
        }
    },
}
</script>

<style lang="scss" scoped>

</style>

