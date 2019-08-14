
export const depthUtil = {

    // earch **** 初始化
    getDepthChartData: (data, regular, that) => {
        if (data.buy[0] || data.sell[0]) {
            that.depthDataS = depthUtil.formatterDepth(data,regular,that);
            depthUtil.setOption(that.depthDataS,regular,that);
        }
    },

    // 深度图数据处理
    sortPipe: (prop, showSymbol) => {
        return function (obj1, obj2) {
            let val1 = obj1[prop];
            let val2 = obj2[prop];
            if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                val1 = Number(val1);
                val2 = Number(val2);
            }
            if (showSymbol) {
                if (val1 > val2) {
                    return -1;
                } else if (val1 < val2) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            }
        };
    },

    formatterDepth: (res,regular,that) => {

        const bids = res.buy.sort(depthUtil.sortPipe('price', true));
        const asks = res.sell.sort(depthUtil.sortPipe('price', false));

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
                amounts.push(regular.toFixed(bidsTotal,that.nowPairInfo.amount_precision));
                prices.push(regular.toFixed(buyData.price,that.nowPairInfo.price_precision));
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
                amounts.push(regular.toFixed(asksTotal,that.nowPairInfo.amount_precision));
                prices.push(regular.toFixed(sellData.price,that.nowPairInfo.price_precision));
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
    setOption: (data,regular,that) => {
        that.depth.setOption({
            // 深度图背景色
            backgroundColor: that.isDark === 'Dark' ? '#1C2439' : '#FFFFFF',
            animation: true,
            axisPointer: {
                link: {
                    // yAxisIndex: [0, 1]
                },
                label: {
                    // backgroundColor: "#777"
                }
            },
            grid: depthUtil.getGrid(data),
            tooltip: depthUtil.getToolTip(regular,that),
            yAxis: depthUtil.getYAxis(data),
            xAxis: depthUtil.getXAxis(data),
            series: depthUtil.getSeries(data)
        }, true);
        window.onresize = that.depth.resize;
    },

    getGrid: () => {
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

    getYAxis: (data) => {
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

    getXAxis: (data) => {
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

    getSeries: (data) => {
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

    getToolTip: (regular, self) => {
        // const self = this;
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
                color: self.isDark ? '#fff' : '#002257'
            },
            extraCssText: 'background:#252332;border:0;color:#ffffff;opacity: 0.7;font-size:12px;',
            formatter: function (param) {
                param = param[0];
                if (param.seriesName === 'sell') {
                    return [
                        '<div style="text-align:left">',
                        '<div style="width:6px;height:6px;background:#AE3D42;border-radius:4px;' +
                        'float:left;margin-top:8px;margin-right:2px;"></div>' +
                        '卖出价格: ' +
                        regular.toFixed(param.axisValue, self.nowPairInfo.price_precision) +
                        '<br/>',
                        '<div style="width:10px;height:6px;background:#AE3D42;border-radius:4px;' +
                        'float:left;margin-top:8px;margin-right:2px;"></div>' +
                        '卖出累计: ' +
                        regular.toFixed(param.data, self.nowPairInfo.amount_precision) +
                        '<br/>',
                        '</div>'
                    ].join('');
                } else if (param.seriesName === 'buy') {
                    return [
                        '<div style="text-align:left">',
                        '<div style="width:6px;height:6px;background:#38BC74;border-radius:4px;' +
                        '       float:left;margin-top:8px;margin-right:2px;"></div>' +
                        '买入价格: ' +
                        regular.toFixed(param.axisValue, self.nowPairInfo.price_precision) +
                        '<br/>',
                        '<div style="width:10px;height:6px;background:#38BC74;border-radius:4px;' +
                        'float:left;margin-top:8px;margin-right:2px;"></div>' +
                        '买入累计: ' +
                        regular.toFixed(param.data, self.nowPairInfo.amount_precision) +
                        '<br/>',
                        '</div>'
                    ].join('');
                }
            }
        }
    }
}