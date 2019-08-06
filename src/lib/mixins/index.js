import { pubSub, watchPubSub} from '../../watch/index'
import reset from '../../utils/resetData'
import regular from '../../utils/regular'
import { User } from '../../utils/user'
const getPrecision = {
    data(){
        return {
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
        this.getInit();
    },
    mounted() {
        watchPubSub.resetData(data =>{this.watchReset(data) })
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
        }
    },
    methods: {
        getInit(){
            this.nowPairInfo = {};
            let pair = window.location.hash.replace('#','')
            reset.getTicker().then( res => {
                if(!pair) pair = 'ETH_BTC'; 
                const Index = res.findIndex(ele => {
                    return ele.pair === pair
                })
                Index != -1 && (this.nowPairInfo = res[Index])
            })
        },
        watchReset(data){
            this.getInit()
        },


        // (用户）公用方法定义如下：
        token(){
            return User.token()
        },

        // 公用方法定义如下：
        toFixed(number,fixed) {
            return regular.toFixed(number,fixed)
        }

    },
}

export { getPrecision }