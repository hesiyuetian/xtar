import axiosService from './axios';
import xtar from './xtar'
import { CONFIG } from './config'
import axios from 'axios'

const api = {
    userAddress: `${CONFIG.apiUrl}/v1/account`,
    assetAddress: `${CONFIG.apiUrl}/v1/asset`,
    ordersAddress: `${CONFIG.apiUrl}/v1/orders`,
    marketAddress: `${CONFIG.apiUrl}/v1/market`,
    commonAddress: `${CONFIG.apiUrl}/v1/common`
}


let service = {

    /**
     * new登录 
     */  
    newLogin: data => {
        const time = new Date().getTime().toString();
        const channel = CONFIG.channel;
        let paramsData = {
            timestamp: time,
            channel: channel,
            sig: xtar.loginSign(time,data.user,channel)
        }
        let config = {
            url: `${api.userAddress}/authorize`,
            method: 'post',
            data: Object.assign(paramsData, data)
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        }) 
    },

    /**
     * 提现
     */
    withdraw: data => {
        let config = {
            url: `${api.assetAddress}/withdraw`,
            method: "post",
            data
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        }) 
    },

    /**
     * 获取所有币种
     */
    coins: data => {
        let config = {
            url: `${api.commonAddress}/coins`,
            method: "get",
            params: {}
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        }) 
    },

    /**
     * 获取所有交易对
     */
    pairs: data => {
        let config = {
            url: `${api.commonAddress}/pairs`,
            method: "get",
            params: {}
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        }) 
    },

    /**
     * 委托下单
     */
    create: data => {
        let config = {
            url: `${api.ordersAddress}/create`,
            method: 'post',
            data
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        }) 
    },

     /**
     * 订单历史
     */
    list: data => {
        let config = {
            url: `${api.ordersAddress}/list`,
            method: 'get',
            params: data
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        }) 
    },

    /**
     * 交易历史
     */
    transactionHistory: data => {
        let config = {
            url: `${api.ordersAddress}/trade/history`,
            method: 'get',
            params: data
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        }) 
    },

    /**
     * 获取二十条交易记录
     */
    newTrade: data => {
        let config = {
            url: `${api.marketAddress}/trade`,
            method: 'get',
            params: data
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        }) 
    },

    /**
     * 所有交易对行情
     */
    getTickers: data => {
        let config = {
            url: `${api.marketAddress}/tickers`,
            method: 'get',
            params: data
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        }) 
    },
    
    /**
     * 收藏交易对
     */
    collectPair: data => {
        let config = {
            url: `${api.userAddress}/collect`,
            method: 'post',
            data
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        }) 
    },

    /**
     * 查询深度全量
     * 
     */
    depthData: data => {
        let config = {
            url: `${api.marketAddress}/depth`,
            method: 'get',
            params: data
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        }) 
    },

    /**
     * 获取收藏的交易对
     */
    getCollectPair: data => {
        let config = {
            url: `${api.userAddress}/collect/list`,
            method: 'get',
            params: data
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        }) 
    },

    /**
     * 委托单撤单
     */
    cancel: data => {
        let config = {
            url: `${api.ordersAddress}/cancel`,
            method: 'post',
            data
        };

        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        }) 
    },
    

    /**
     * 委托单列表
     */
    tradeList: data => {
        let config = {
            url: `${api.ordersAddress}/trade`,
            method: 'get',
            params: data
        };
        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        }) 
    },

    /**
     * 资产列表
     */
    assetList: () => {
        let config = {
            url: `${api.assetAddress}/list`,
            method: 'get',
            params: {}
        };
        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        }) 
    },
    
    /**
     * 资产列表更新
     */
    getBalance: data => {
        let config = {
            url: `${api.assetAddress}/balance`,
            method: 'get',
            params: data
        };
        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        }) 
    },

    /**
     * 资产详情
     */
    assetDetail: data => {
        let config = {
            url: `${api.assetAddress}/detail`,
            method: 'get',
            params: data
        };
        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        }) 
    },

    /**
     * 资产充值/提现记录
     */
    assetHistory: data => {
        let config = {
            url: `${api.assetAddress}/history`,
            method: 'get',
            params: data
        };
        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        }) 
    },

    /**
     * 资产充值/提现记录 详情
     */
    assetHistoryDetail: data => {
        let config = {
            url: `${api.assetAddress}/history/detail`,
            method: 'get',
            params: data
        };
        return new Promise((resolve,reject)=>{
            axiosService(config)
            .then((data) => {
                resolve(data.data);
            })
            .catch()
        }) 
    },

    /**
     * 交易对比率
     */
    // parils: async params => {
    //     let config = {
    //         url: `${api.commonAddress}/priceConversion`,
    //         method: 'get',
    //         params: params
    //     };
    //     return new Promise((resolve,reject)=>{
    //         axiosService(config)
    //         .then((data) => {
    //             resolve(data.data);
    //         })
    //         .catch()
    //     }) 
    // },

    // 获取BTC--->USD汇率
    getOkexTime: () => {
        return axios.get('https://min-api.cryptocompare.com/data/price', {
        　　params: {
                fsym: 'BTC',
                tsyms: 'USDT',
            }
        })
    }
}

export default service