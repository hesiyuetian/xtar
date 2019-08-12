import xtar from './xtar'
import load from './loading'
import xtarUtil from './xtarUtil'
import { User } from './user'

function xtarSign(){
    this.client = null;
    this.initClient = () => {
		if (!xtarSign.client) {
			xtarSign.client = new xtar.RpcClient([CONFIG.sdkUrl]);
		}
	}

	// 提现验签
	this.withdrawSig = (option, password ) => {
		let dWithDrawArgs = new xtar.DWithdrawArgs(
			option.asset,
			option.from,
			option.to,
			option.amount,
			option.fee,
			option.salt,
			option.extra,
		);

		let account;
		account = this.unluck(password);

		if (account) {
			try {
				dWithDrawArgs.Sign(account);
				return dWithDrawArgs.signature.serialize()
			} catch(e){
				return load.tipErrorShow("签名失败")
			}
		}
	}

	// 充值
	this.deposit = (option, password) =>  {
		let account, result;
		if (password) {
			account = this.getAccount(password);
		} else {
			account = this.getPrivateAccount();
		}

		if (account) {
			option.payer = account.address;
			try {
				let a = xtar.Dex.CreateDepositTx(option.payer, option.asset, option.from, option.to, option.value);
				const signdata = account.sign(a.GetHash());
				a.tx.sig = [signdata]
				result = xtarSign.client.SendRawTransaction(a.serialize());
			} catch(e){
				return load.tipErrorShow("签名失败")
			}
		}
		return result;
	}

	// 交易签名
	this.orderSign = (option, password) => {
		let account;
		account = this.unluck(password);
		if (account) {
			try {
				let orderData = new xtar.OrderData(
					option.version, account.address, option.pair, option.side, option.price, option.amount, option.channel, option.fee, option.expire, option.salt
				)
				orderData.Sign(account);
				return orderData.signature.serialize()
			} catch(e){
				return load.tipErrorShow("签名失败")
			}
		}
	}
	
	// 登录签名
	this.loginSign = (time, user, channel, password) => {
		let account;
		account = this.unluck(password);

		if (account) {
			try {
				const signature = new xtar.TxSignatureImpl()
				signature.m = 1
				signature.public_keys.push(account.crypto.getPublicKeyWithType())
				const dataHash = xtar.sha256HexString(Buffer.from(`${channel}${user}${time}`).toString('hex'))
				signature.sig_data.push(account.signHash256(dataHash))
				return signature.serialize();
			} catch(e){
				return load.tipErrorShow("签名失败")
			}
		}
	} 
	
	//查询xtar/token余额  asset:合约地址  测试参数：(user = 'AGMnLU36P3rvawJUo2sjJxwQ7po5Fgaaez',asset = '2f191d48eedcf69ef605007cca7d01766533a992')
	this.getBlanace = asset => {
		let constract, user = User.getObject('account').userId;
		if (asset) constract = asset;  // 查询token余额
		else constract = '0000000000000000000000000000000000000001'; // 查询xtar余额
		return xtarSign.client.GetBlanceOf(user, constract)
	}

	//查询dex余额  asset:合约地址  测试参数：(user = 'AGMnLU36P3rvawJUo2sjJxwQ7po5Fgaaez',asset = '2f191d48eedcf69ef605007cca7d01766533a992')
	this.getDexBlanace = (asset, precision) => {
		const blanace = new xtar.Dex(this.client), user = User.getObject('account').userId;;
		blanace.BalanceOf(user, asset).then(res => {
			const result = this.regular.toFixed(res / (10 ** precision), precision)
			// load.txid(result)
			this.dialog.createFromComponent(AssestComponent, result)
		})

		// return blanace.BalanceOf(user, asset)
	}

	// 获取本地keyStore文件
	this.getKeyStore = () => {
		return User.getObject('user_login_keystore')
	}

	this.unluck = (password) => {
		let account;
		if (!!password) {
			account = this.getAccount(password);
		} else {
			account = this.getPrivateAccount();
		}
		return account;
	}

	// 获取account
	this.getAccount = (password) => {
		const keyStore = this.getKeyStore();
		if (Object.keys(keyStore).length < 1) return User.logout();
		let account = false, _account = xtarUtil.load(JSON.stringify(keyStore.keyStore), password);
		if (keyStore.type === 'key') {
			_account.status == 0 && (account = _account.msg);
		} else {
			if (_account.status == 0) {
				let privateKey = xtarUtil.entropyToMnemonic(_account.msg.crypto.privateKey);
				account = xtarUtil.create(2, password, privateKey).msg
			}
		}
		if (!account) {
			return load.tipErrorShow("密码错误")
		}
		User.setItemlocalCrypt('account_sig', account.crypto.privateKey + '-' + new Date().getTime())
		return account;
	}

	// 通过私钥获取account
	this.getPrivateAccount = () => {
		let account = false;
		const privateKey = User.getItemlocalCrypt('account_sig').split('-')[0];
		account = xtarUtil.create(3, 'april', privateKey).msg;
		if (!account) {
			return load.tipErrorShow("密码错误")
		};
		return account;
	}

	//获取token信息
	this.getTokenInfo = asset => {
		let token = new xtar.Token(this.client);
		return token.TokenInfo(asset);
	}

	//获取BxaToken信息
	this.getBxaTokenInfo = asset => {
		let token = new xtar.XTAR(this.client);
		token.XTARInfo().then(res => {
			console.log(res)
		})
	}

	//获取当前区块高度
	this.getCurrentHeight = async () => {
		if (!this.client) { this.initClient() }
		let current = await xtarSign.client.GetCurrentHeight();
		return current.result
	}


	//钱包创建、重置密码
	//type: 2 = 助记词， 3 = 私钥
	this.create = (type, password, value) => {
		let privateKey = type == 2 ? this.ethereumCreatePri(value) : value;
		let json = xtar.Wallet.Create(password, privateKey);
		var blob = new Blob([json.toJson()], { type: "text/plain;charset=utf-8" });
		fileSaver.saveAs(blob, "keystore.json");
		return { status: 0, msg: json }
	}

	//ethereumjs 生成私钥
	this.ethereumCreatePri = word => {
		let seed = bip39.mnemonicToSeed(word);
		let hdWallet = hdkey.fromMasterSeed(seed);
		let key = hdWallet.derivePath("m/44'/388'/0'/0/0");
		let privateKey = key.getWallet().getPrivateKey().toString('hex');
		if (privateKey.length % 2 != 0) {
			privateKey = '0' + privateKey;
		}
		return privateKey
	}

	this.getOrderInfo = txid => {
		load.loadingShow();
		xtarSign.client.GetEventLog(txid).then( res => {
			load.hide();
			if(res.error.code === 0) {
				let result = res.result.event_logs.filter(ele =>{
					return ele.contract.indexOf('000000000000004') != -1
				})
				res.result.event_logs = result;
				this.dialog.createFromComponent(TxComponent, res.result)
			}
			else load.tipErrorShow(res.error.message)
		})
	}

	// 获取Xtar资源
	this.getXtarScource = () => {
		const client = xtar.Provider.NewProvider(CONFIG.sdkUrl);
		const _q = new Query(client);
		const user = User.getObject('account').userId;
		return _q.getAllScource(user)
	}

	// 私钥是否超期
	this.isExpirTime = () => {
		if (!User.getItemlocalCrypt('account_sig')) return true;
		return new Date().getTime() - Number(User.getItemlocalCrypt('account_sig').split('-')[1]) > this.expirTime * 60 * 1000;
	}
}

export default new xtarSign();