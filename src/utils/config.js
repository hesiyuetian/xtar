const debug = 'UAT';

const UAT = {
    channel: 'XemcAUrqxnQK3SB1mETPFqSw49WwZ5r9EL',
    wsUrl: 'http://47.103.100.47:9001',
    sdkUrl: 'http://47.103.100.47:43026',
    apiUrl: 'http://47.103.100.47:8888',
    version: 0x05010000
}

const TEST = {
    channel: 'AUZ4d82hCeLhKS6nhvz9gRApKfjJwyVQ8B',
    wsUrl: 'http://api.test.lyra.site:9001',
    sdkUrl: 'http://52.76.192.14:43026',
    apiUrl: 'https://beta-xtar.lyra.site',
    version: 0x05010000
}

const BETA = {
    channel: 'XemcAUrqxnQK3SB1mETPFqSw49WwZ5r9EL',
    wsUrl: 'wss://beta-wss.lyra.site',
    sdkUrl: 'https://beta-xtar.lyra.site',
    apiUrl: 'https://beta-api.lyra.site',
    version: 0x05010000
}

const PRO = {
    channel: 'AUZ4d82hCeLhKS6nhvz9gRApKfjJwyVQ8B',
    Url: 'https://test.lyra.site',
    sdkUrl: 'http://52.76.192.14:43026',
    apiUrl: 'https://beta-xtar.lyra.site',
    version: 0x00010000
}

export const CONFIG = 
            debug === 'UAT' 
            ? UAT 
            : debug === 'PRO' 
            ? PRO 
            : debug === 'BETA' 
            ? BETA
            : TEST;