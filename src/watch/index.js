import PubSub from 'pubsub-js'

export const pubSub = {
    // 发布事件

    // 发布 改变交易对，初始化数据
    resetData: data => {
        console.log(12121)
        PubSub.publish('changePair', data)
    },

    // 发布 深度推送到深度图
    changeDepth: data =>{
        PubSub.publish('changeDepth', data)
    },

    // 发布 当前交易对数据
    changeTicker: data => {
        PubSub.publish('changeTicker', data)
    },

    // 发布 scoket推送数据
    scoket: data => {
        PubSub.publish('scoket', data)
    },

    // 发布 scoket推送数据
    newOrder: data => {
        PubSub.publish('newOrder', data)
    },
}


export const watchPubSub = {
    // 发布事件
    // 
    resetData: FN => {
        PubSub.subscribe('changePair', (data) => {
            FN(data)
        })
    },

    changeDepth: FN =>{
        PubSub.subscribe('changeDepth', (data) => {
            FN(data)
        })
    },

    changeTicker: FN => {
        PubSub.subscribe('changeTicker', (data) => {
            FN(data)
        })
    },

    scoket: FN => {
        PubSub.subscribe('scoket', (data) => {
            FN(data)
        })
    },

    newOrder: FN => {
        PubSub.subscribe('newOrder', (data) => {
            FN(data)
        })
    },
}
