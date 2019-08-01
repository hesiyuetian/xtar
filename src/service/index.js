/**
 * Created by hemengen on 2018/3/18.
 */
import axiosService from './axios';
import { CONFIG } from './config'

let meta = {
    userAddress:   `${CONFIG.apiUrl}/v1/account`,
    assetAddress:  `${CONFIG.apiUrl}/v1/asset`,
    ordersAddress: `${CONFIG.apiUrl}/v1/orders`,
    marketAddress: `${CONFIG.apiUrl}/v1/market`,
    commonAddress: `${CONFIG.apiUrl}/v1/common`
}

let api = {};


/**
* 获取所有币种
*/
api.coins = (data) => {
   let config = {
       url: `${meta.commonAddress}/coins`,
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
}

/**
 * 获取所有交易对
 */
api.pairs = (data) => {
    let config = {
        url: `${meta.commonAddress}/pairs`,
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
}


export default api
