import { secret } from './secret';
const keyStoreName = 'user_key_store';
export const User = {
    setItemSession: (key, value) => {
        window.sessionStorage[key] = value;
    },
    getItemSession: (key) => {
        return window.sessionStorage[key] == undefined ? '' : window.sessionStorage[key];
    },

    // 加密obj
    setItemSessionCrypt: (key, value) => {
        if(typeof value == "object") window.sessionStorage[key] = secret.encrypt(JSON.stringify(value))
        else window.sessionStorage[key] = secret.encrypt(value);
    },
    getItemSessionCrypt: (key) => {
        return window.sessionStorage[key] == undefined ? '' : secret.decrypt(window.sessionStorage[key]);
    },
    

    setItemSessionObj: (key, value) => {
        window.sessionStorage[key] = JSON.stringify(value);
    },
    getItemSessionObj: (key) => {
        return JSON.parse(window.sessionStorage[key] || '{}')
    },


    setItem: (key, value) => {
        window.localStorage[key] = value;
    },
    getItem: (key) => {
        return window.localStorage[key] == undefined ? '' : window.localStorage[key];
    },
    // 加密obj
    setItemlocalCrypt: (key, value) => {
        if(typeof value == "object") window.localStorage[key] = secret.encrypt(JSON.stringify(value))
        else window.localStorage[key] = secret.encrypt(value);
    },
    getItemlocalCrypt: (key) => {
        return window.localStorage[key] == undefined ? '' : secret.decrypt(window.localStorage[key]);
    },
    setObject: (key, value) => {

        // 处理登录返回数据的存储
        if(key === 'account'){
            value.userId = value.user;
            delete value.user;
        }

        
        try {
            window.localStorage[key] = JSON.stringify(value);
        } catch (e) {
            alert('本地储存写入错误，若为safari浏览器请关闭无痕模式浏览。');
        }
    },
    getObject: (key) => {
        return JSON.parse(window.localStorage[key] || '{}');
    },
    remove: (key) => {
        window.localStorage.removeItem(key);
    },

    // 刷新网页
    reload: () => {
        if(window.location.href.indexOf('/trade/') != -1){
            return window.location.reload()
        }else if(window.location.href.indexOf('/user/login') == -1){
            return window.location.href = window.location.origin + '/user/login' ;
        }
    },

    logout: () => {
        // User.reload();
        const user = ['account', 'user_login_keystore', 'publicKey', 'account_sig'];
        for(let item of user){
            window.localStorage.removeItem(item);
        }
    },
    token: () => {
        return User.getObject('account') == undefined ? '' : User.getObject('account')['access_token'];
    },
    userId: () => {
        return User.getObject('account') == undefined ? '' : User.getObject('account')['userId'];
    },
    account: () => {
        return User.getObject('account') == undefined ? '' : User.getObject('account')['email'];
    },

    //缓存本地KEY_Store
    addLocalKey: (data) => {
        let list = User.getItem(keyStoreName);
        let arr = [];
        if(list){ 
            arr = JSON.parse(User.getItem(keyStoreName)) 
            arr = arr.filter( ele => {
                return ele.address != data.address
            })
        }
        arr.push(data);
        User.setItem(keyStoreName, JSON.stringify(arr));
    },

    //修改密码后替换缓存中的keystore
    resetLocalOneKey: (data) => {
        const name = data.name;
        const address = data.address
        const keyStore = data.keyStore;
        let list = JSON.parse(User.getItem(keyStoreName));
        for(let i of list){
            if((i.name == name)&& (i.address == address)){
                i.keyStore = keyStore;
                break;
            }
        }
        User.setItem(keyStoreName, JSON.stringify(list));
    },
    //储存私钥 + 时间催
    setPriDate: (privateKey) => {
        let pri = privateKey +'-'+ new Date().getTime();
        User.setItem('account_sig', secret.encrypt(pri));
    },

    
    // tradingView 清除
    clearTV: () => {
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