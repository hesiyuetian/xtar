// import {Storage} from './localStorage'
export const User = {
    // 刷新网页
    reload: ()=>{
        if(window.location.href.indexOf('/trade/') != -1){
            return window.location.reload()
        }else if(window.location.href.indexOf('/user/login') == -1){
            return window.location.href = window.location.origin + '/user/login' ;
        }
    },

    setItem: (key, value)=> {
        window.localStorage[key] = value;
    },

    logout:()=>{
        // this.reload();
        const user = ['account', 'user_login_keystore', 'publicKey', 'account_sig'];
        for(let item of user){
            window.localStorage.removeItem(item);
        }
    },
    token:()=>{
        return ''
    },
    
    // tradingView 清除
    clearTV:()=>{
        const tv = [
            'tvxwevents.setting',
            'tradingview.chartType',
            'tradingview.BarsMarksContainer.visibile',
            'tradingview.ChartFavoriteDrawingToolbarWidget.visible',
            'tradingview.ChartSideToolbarWidget.visible',
            'tradingview.NavigationButtons.visibility',
            'tradingview.chartproperties',
            'tradingview.symboledit.dialog_last_entry',
            'tvlocalstorage.available',
            'tvxwevents.settings'
        ];
        for(let item of tv){
            window.localStorage.removeItem(item);
        }
    }
}