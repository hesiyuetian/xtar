import io from 'socket.io-client';
import { pubSub } from '../watch/index'
import regular from './regular'
import { CONFIG } from './config'

function WS(){
    this.socket = null,
    this.disLinkNumber = 0;
    this.symbol = 0;
    this.isClientSocket = true;
    this.addEventSocketFlag = true;

    this.onCenten = symbol => {
        this.disLinkNumber = 0;
        this.addEventSocketFlag = true;
        let url = CONFIG.wsUrl;
        if(this.isClientSocket){
            this.isClientSocket = false;
            this.symbol = symbol;
            this.socket = io(url, {
                path: '/realtime',
                query: {
                    "pair": symbol,
                },
                reconnection: true,
                reconnectionAttempts: 11,
                reconnectionDelay: 10000,
                // randomizationFactor: 1,
                reconnectionDelayMax: 30000,
            });
        }else{
            this.emitPair(symbol)
        }
        this.wsReceiveSocket();
        this.addEventSocket();
    }

    this.addEventSocket = () => {
        if(this.socket){
            this.socket.on('connect_timeout', function(data){
                console.log('链接超时 - connect_timeout');
            });

            this.socket.on('disconnect', (res) => {
                console.log('链接断开 - disconnect')
                if(this.disLinkNumber <= 10 && this.addEventSocketFlag){
                    setTimeout(()=>{
                        this.socket.on('reconnect',() => {

                        })
                        this.socket.open();
                    },1000 * 5)
                }
                this.disLinkNumber ++;
            })
        }
    }

    this.emitPair = (symbol) => {
        if(this.socket){
            this.socket.emit('subscribe',{"pair": symbol},(data)=>{
                this.symbol = symbol;
            })
        }
    }

    // 监听
    this.wsReceiveSocket = () => {
        this.socket.on('connect', res => {
            
            this.socket.on("trade",res=>{ /*  Trade - 最新交易 */ 
                if(res.data.length > 0 && res.data[0].pair !== this.symbol)  return ;
                let data = { type:'trade', result: null};
                data.result = res;
                pubSub.scoket(data)
            })
            
            this.socket.on("depth",res=>{ /*  Depth - 深度数据 */ 
                if(res.data.pair !== this.symbol) return ;
                let data = { type:'depth', result: null};
                res.data.buys = regular.makeDepth(res.data.buys);
                res.data.sells = regular.makeDepth(res.data.sells);
                data.result = res;
                pubSub.scoket(data)
            })

            this.socket.on("ticker",res=>{    /*  Ticker - 最新价格 */ 
                let data = { type:'ticker', result: null};
                data.result = res;
                pubSub.scoket(data)
            })
        })
    }

    this.wsCloseSocket = () => {
        if(this.socket){
            this.addEventSocketFlag = false;
            this.socket.emit('unsubscribe',{"pair": this.symbol},(data)=>{
                // this.socket.close();
                // clearInterval(this.timers);
            })
        }
    }
}

const socket = new WS()
export default socket