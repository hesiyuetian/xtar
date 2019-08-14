import { pubSub, watchPubSub} from '../../watch/index'
import reset from '../../utils/resetData'
import regular from '../../utils/regular'
import { User } from '../../utils/user'

const getPrecision = {
    data(){
        return {
            // 价格精度
            price_precision: 8,
            nowPairInfo: {
                amount_precision: 3,
                base: "",
                base_precision: 8,
                base_vol: "",
                change: "",
                close: "",
                high: "",
                listed: true,
                low: "",
                min_amount: "",
                open: "",
                pair: "",
                pair_address: "",
                price_precision: 5,
                quote: "",
                quote_precision: 8,
                quote_vol: "",
                trade: false,
                v: ""
            }
        }
    },
    created() {
        reset.inits();
        this.watchHash();
    },
    mounted() {
        this.getInit("init");
        watchPubSub.resetData(data => {this.getInit("hash")})
        watchPubSub.scoket( data => {
            if(data.type === 'ticker'){
                if(data.result.data.pair === this.nowPairInfo.pair){
                    this.nowPairInfo.v = data.result.data.v;
                    this.nowPairInfo.close = data.result.data.close;
                    this.nowPairInfo.change = data.result.data.change;
                    this.nowPairInfo.base_vol = data.result.data.base_vol;
                    this.nowPairInfo.high = data.result.data.high;
                    this.nowPairInfo.low = data.result.data.low;
                    this.nowPairInfo.open = data.result.data.open;
                    this.nowPairInfo.quote_vol = data.result.data.quote_vol;
                }
            }
        })
    },
    
    filters: {
        utcTolocal(value){
            if(!value) return value;
            
            //转化为utc时间格式
            let utcTime = value.replace(' ', 'T')+'Z';
            let newDate = new Date(utcTime);
            let YY = newDate.getFullYear() + '-';
            let MM = (newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1) + '-';
            let DD = (newDate.getDate() < 10 ? '0' + (newDate.getDate()) : newDate.getDate());
            let hh = (newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours()) + ':';
            let mm = (newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes()) + ':';
            let ss = (newDate.getSeconds() < 10 ? '0' + newDate.getSeconds() : newDate.getSeconds());

            return YY + MM + DD +" "+hh + mm + ss
        },
        
        // 交易方向
        transactionStatus(status) {
            const _status = {0: '买', 1: '卖'};
            return _status[status]
        },

        // 订单状态
        orderStatus(status) {
            const _status = {0: '提交成功', 1: '委托成功',2: '部分成交',3: '完全成交',4: '已撤销',5: '撤销中'};
            return _status[status]
        },

        // 交易状态
        tradStatus(status) {
            const _status = {1: '等待上链',2: '上链超时',3: '待确认',4: '确认成功',5: '上链失败'};
            return _status[status]
        },

        // 时间日期
        format(time,status) {
            var t = time
            var commonTime = new Date(t)
            var y =
            commonTime.getFullYear() >= 10
                ? commonTime.getFullYear()
                : '0' + commonTime.getFullYear()
            var month =
            commonTime.getMonth() + 1 >= 10
                ? commonTime.getMonth() + 1
                : '0' + (commonTime.getMonth() + 1)
            var d =
            commonTime.getDate() >= 10
                ? commonTime.getDate()
                : '0' + commonTime.getDate()
            var h =
            commonTime.getHours() >= 10
                ? commonTime.getHours()
                : '0' + commonTime.getHours()
            var m =
            commonTime.getMinutes() >= 10
                ? commonTime.getMinutes()
                : '0' + commonTime.getMinutes()
            var s =
            commonTime.getSeconds() >= 10
                ? commonTime.getSeconds()
                : '0' + commonTime.getSeconds()

            if (status === 1) return h + ':' + m + ':' + s
            else if (status === 2) return y + '-' + month + '-' + d + ' ' + h + ':' + m
            else if (status === 3) return y + '-' + month + '-' + d + ' ' + h + ':' + m + ':' + s
            else if (status === 4) return y + '-' + month + '-' + d
        }
    },
    methods: {
        watchHash(){
            if( ("onhashchange" in window) && ((typeof document.documentMode==="undefined") || document.documentMode==8)) {
                window.onhashchange = hashChangeFire;
              } else {
                setInterval(function() {
                    var ischanged = isHashChanged();
                    if(ischanged) {
                        hashChangeFire();  
                    }
                }, 150);
              }
              function hashChangeFire(){ pubSub.resetData() }
        },
        getInit(type){
            this.nowPairInfo = {};
            let pair = window.location.hash.replace('#','')
            reset.getTicker().then( res => {
                if(!pair) pair = 'BTC_USDT'; 
                const _Index = res.findIndex(ele => {
                    return ele.pair === "BTC_USDT"
                })
                const Index = res.findIndex(ele => {
                    return ele.pair === pair
                })

                if(Index != -1) this.nowPairInfo = res[Index],this.price_precision = res[Index].price_precision
                else this.nowPairInfo = res[_Index],this.price_precision = res[_Index].price_precision

                if(type === 'init') reset.initWS(this.nowPairInfo.pair);
                else if(type === 'hash') reset.emitPair(this.nowPairInfo.pair);
                
            })
        },

        // (用户）公用方法定义如下：
        token(){
            return User.token()
        },

        // 公用方法定义如下：
        toFixed(number,fixed) {
            return regular.toFixed(number,fixed)
        },
        toBigsells(numberAry , fixed){
            return regular.toBigsells(numberAry,fixed)
        }

    },
}

export { getPrecision }