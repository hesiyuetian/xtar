import service from './service';
import regular from './regular';
import { pubSub } from '../watch/index'
import scoket from './scoket'
function resetData(){
    // 行情列表(需要一直维护)
    this.ticker = [];
    this.tickerFlag = false;

    // depth数据
    this.depthList = [];

    // pair
    this.pairsList = [];

    // 初始化数据标记
    this.resetFlag = true;

    // 初始化ws数据标记
    this.wsFlag = true;

    // 初始化基础数据
    this.inits = () => {
        if(this.resetFlag){
            this.resetFlag = false;
            this.resetTicker()
        }
    }

    // 初始化WS
    this.initWS = (pair) => {
        if(this.wsFlag){
            this.wsFlag = false;
            scoket.onCenten(pair)
        }
    }

    // 切换WS交易对
    this.emitPair = (pair) => {
        if(this.wsFlag){
            scoket.emitPair(pair)
        }
    }

    /**
     * 获取所有交易对
     */
    this.pairs = () => {
        return new Promise((resolve,reject) => {
            service.pairs().then((res) => {
                if(res.status === 0){
                    resolve(res.data);
                    this.pairsList = res.data;
                }
            })
        })
        
    }

    this.getPairs = () => {
        let pairs = this.pairsList;
        return new Promise((resolve,reject) => {
            if(pairs.length < 1){
                this.pairs().then( res => {
                    resolve(res);
                });
            }else resolve(pairs)
        })
    }

    // 整合ticker
    this.resetTicker = () => {
        this.tickerFlag = false;
        return new Promise((resolve,reject) => {
            this.getPairs().then(res => {
                service.getTickers().then( data =>{
                    if(data.status === 0) {
                        let result = data.data
                        for(let item of res){
                            const Index = result.findIndex(ele => {
                                return ele.pair === item.pair
                            })
                            if(Index != -1 ) result[Index] = {...result[Index], ...item}
                        }
                        
                        this.ticker = result;
                        this.tickerFlag = true;
                        resolve(result)
                    }
                    else this.ticker = []
                })
            })
        })
    }
    
    // 获取整合后的ticker
    this.getTicker = () => {
        var time = null;
        return new Promise((resolve,reject) => {
            if(this.tickerFlag) return resolve(this.ticker)
            time = setInterval(()=>{
                if(this.tickerFlag){
                    clearInterval(time);
                    resolve(this.ticker)
                }
            },500) 
        })
    }


    /**
     * 
     * BTC==> USDT 估值处理
     * 
     */


    /**
      * 匹配交易对  获取并计算该币对应BTC的价格
      * @param symbol  币种
      * @param tickerList  行情列表
      * @param available 可用余额
      */
    this.matchPair = (symbol,tickerList,available) =>{
        // console.log(symbol,tickerList,available)
        if(!!!available) available = 1;
        
        // 特殊处理资产列表BTC估值
        if(symbol === 'BTC'){
            return available
        }

        const list = tickerList.filter(ele => {
            return symbol === 'BTC' && ele.pair === 'BTC_USDT'
        })
        if(list.length > 0) return regular.toBigsells([regular.toDividedBy(1, list[0].close, 8), available], 8) || 0

        const list2 = tickerList.filter(ele => {
            return symbol === ele.pair.split('_')[0] && ele.pair.split('_')[1] === 'BTC'
        })
        if(list2.length > 0) return regular.toBigsells([list2[0].close, available], 8)

        for(let item of tickerList){
            if(symbol === item.pair.split('_')[0]){
                let _list = tickerList.filter(ele => {
                    return item.pair.split('_')[1] === ele.pair.split('_')[0] && ele.pair.split('_')[1] === 'BTC'
                })
                return (_list[0] && regular.toBigsells([_list[0].close, item.close, available], 8)) || '--'
            };
        }
        return '--'
    }

     /**
      * 计算BTC ==> USDT的价格
      * @param symbol  币种
      * @param tickerList  行情列表
      * @param available 可用余额
      * @param usdtPrice 1BTC对应的USDT价格
      * @param pair 交易页面估值传入的交易对
      */
    this.raleUsdt = (symbol,tickerList,available,usdtPrice,pair) => {
        if(!!!available) available = 1;
        
        let btcPrice = this.matchPair(symbol, tickerList || '', 1);

        // 特殊处理资产列表USDT、BTC估值
        if(symbol === 'USDT' && !pair) return available;
        if(symbol === 'BTC' && !pair) return regular.toBigsells([usdtPrice, available], 4);



        // 特殊处理 交易页面 两大quote下面的估值
        const ary = tickerList.filter(ele => {
            return ele.pair === `${symbol}_USDT`
        })
        const aryBtc = tickerList.filter(ele => {
            return ele.pair === `${symbol}_BTC` && ele.pair === pair
        })

        // 特殊处理 交易页面  BTC
        if(aryBtc[0] && pair) return regular.toBigsells([aryBtc[0].close, usdtPrice, available], 4)

        // 特殊处理 交易页面  USDT
        if(ary[0] && pair ) return regular.toBigsells([ary[0].close,available], 4)
        else  return btcPrice != '--' ? regular.toBigsells([btcPrice, usdtPrice, available], 4) : '--';
    }

    // 获取 BTC ==> USDT的价格
    this.getUsdt = () => {
        return service.getOkexTime().then( res => {
            return res.data.USDT || 1;
        })
    }

    //获取行情数据 - new
	this.getPairsList = () => {
		return service.getPairsList({}).then( (res) => {
            return (res.status === 0 && res.data) || []
        })
    }
}
const reset = new resetData()
export default reset