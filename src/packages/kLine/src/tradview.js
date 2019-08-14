export const tv = {
    //K线图全屏
    launchFullScreen: element => {
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

    // k线主题样式
    getOverrides: theme => {
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

    // 创建均线
    createStudy: widget => {
        widget.chart().createStudy('Moving Average', false, false, [5], null, { 'Plot.color': 'rgb(150, 95, 196)' });
        widget.chart().createStudy('Moving Average', false, false, [10], null, { 'Plot.color': 'rgb(116,149,187)' });
        widget.chart().createStudy('Moving Average', false, false, [20], null, { "plot.color": "rgb(58,113,74)" });
        widget.chart().createStudy('Moving Average', false, false, [30], null, { "plot.color": "rgb(118,32,99)" });
    },

    // 创建tradingView
    createButton: (widget,_this) => {
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
        var resolution = _this.cycle, chartType = 1;
        
        for (var i = 0; i < buttons.length; i++) {
            (function (button) {
                widget.createButton()
                    .attr('title', button.title).addClass("mydate")
                    .text(button.title)
                    .on('click', function (e) {
                        if ($(this).parent().hasClass('active')) {
                            return false;
                        }
                        localStorage.setItem('tradingview.resolution', button.resolution);
                        localStorage.setItem('tradingview.chartType', button.chartType);
                        $(this).parent().addClass('active').siblings('.active').removeClass('active');
                        widget.chart().setResolution(button.resolution, function onReadyCallback() { });
                        if (button.chartType != widget.chart().chartType()) {
                            widget.chart().setChartType(button.chartType);
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
    getDisFeatures: () => {
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
    getEnFeature: () => {
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
    }
}

