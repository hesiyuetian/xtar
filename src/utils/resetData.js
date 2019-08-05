import service from './service';
import { regular } from './regular';
import stores from '../dataStore';
import { pubSub } from '../watch/index'
function resetData(){
    this.pairsList = [];
    this.coinsList = [];
    this.inits = () => {
        Promise.all([this.pairs(),this.coins()])
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

    /**
     * 获取所有币种
     */
    this.coins = () => {
        return new Promise((resolve,reject) => {
            service.coins().then((res) => {
                if(res.status === 0){
                    resolve(res.data);
                    this.coinsList = res.data;
                }
            })
        })
    }
    
    this.getCoins = () => {
        let coins = this.coinsList;
        return new Promise((resolve,reject) => {
            if(coins.length < 1){
                this.coins().then( res => {
                    resolve(res);
                });
            }else resolve(coins)
        })
    }

    // 获取ticker数据
    this.getTicker = () => {
        return new Promise((resolve,reject) => {
            service.getTickers().then( res =>{
                if(res.status === 0) resolve(res.data)
                else throw('xtar plugs GET tickers is error')
            })
        })
    }
    this.resetTicker = async () => {
        const pairsList = await this.getPairs();
        const ticker = await this.getTicker();
        for(let item of pairsList){
            const Index = ticker.findIndex(ele => {
                return ele.pair === item.pair
            })
            if(Index != -1 ) ticker[Index] = {...ticker[Index], ...item}
        }
        stores.ticker = ticker;
        pubSub.resetData()
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