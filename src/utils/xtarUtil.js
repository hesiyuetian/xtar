import xtar from './xtar'
function xtarServe(){
    //bip39随机生成助记词
    this.bip39WordCreate = () => {
        //128-12位助记词  160-15位 256-24位
        return bip39.generateMnemonic(160);
    }
    //ethereumjs 生成私钥
    this.ethereumCreatePri = word => {
        let seed = bip39.mnemonicToSeed(word);
        let hdWallet = hdkey.fromMasterSeed(seed);
        let key = hdWallet.derivePath("m/44'/388'/0'/0/0");
        let privateKey = key.getWallet().getPrivateKey().toString('hex');
        if(privateKey.length % 2 != 0){
            privateKey = '0' + privateKey;
        }
        return privateKey
    }
    //私钥生成钱包地址  EcdsaImpl(1, pri)
    this.priToaddress = pri => {
        // let account = new xtar.Ecdsa(pri, 'Ecdsa256WithSha256');
        // return account
        let account = new xtar.EcdsaImpl(1, pri);
        let data = {
            account: account,
            address: account.getAddress().address,
            publicKey: account.publicKey,
            privateKey: account.privateKey
        }
        return data
    }

    //Keystroe解锁
    this.load = (keyStroe, password) => {
        try{
            let json = xtar.Wallet.Load(keyStroe, password);
            return { status: 0, msg: json }
        }catch(err){
            return { status: 1, msg: '解锁失败，请确认keyStroe和密码是否匹配' }
        } 
    } 

    //钱包创建、重置密码
    //type: 2 = 助记词， 3 = 私钥
    this.create = (type, password, value) => {
        let privateKey = type == 2 ? this.ethereumCreatePri(value) :  value;
        let json = xtar.Wallet.Create(password, privateKey);
        
        return { status: 0, msg: json } 
    }

    //助记词转化熵
    this.mnemonicToEntropy = word => {
        let pr = bip39.mnemonicToEntropy(word);
        let bNum = 64 - pr.length;
        let num = bNum - bNum.toString().length;
        let vacancy = '';
        for(let i=0; i<num; i++){
            vacancy+= '0';
        }
        let newPr = bNum + vacancy + pr;
        return newPr
    }

    //熵转化助记词
    this.entropyToMnemonic = privateKey => {
        let num = privateKey.substring(0, 2);
        let privateKeys = privateKey.substring(num, privateKey.length)
        return bip39.entropyToMnemonic(privateKeys);
    }

    //验证助记词
    this.validateMnemonic = mnemonic => {
        return bip39.validateMnemonic(mnemonic);
    }

    //重置密码
    //type: 2 = 助记词， 3 = 私钥
    this.resetPassword = (type, password, privateKey) => {
        return this.create(type, password, privateKey);
    }
}

export default new xtarServe();