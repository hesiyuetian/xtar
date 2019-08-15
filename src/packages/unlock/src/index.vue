<template>
    <div class="main min-height-vh">
        <div class="main-body">

            <!-- 选择解锁方式 -->
            <div class="container" v-if="step == 1">
                <h3 class="row1-col1" >导入钱包</h3>
                <p class="row1-col2">选择导入方式</p>
                <div class="row1-col3">
                    <div class="row1-col3-col" @click="select('z1')">
                        <div class="row1-col3-col-head">
                            <div>
                                <img class='initial' src="https://images.lyra.site/mnemonic.png" />
                                <img class='hover' src="https://images.lyra.site/mnemonic-hover.png" />
                            </div>
                        </div>
                        <p>助记词（SEED）</p>
                    </div>
                    <div class="row1-col3-col" @click="select('k1')">
                        <div class="row1-col3-col-head">
                            <div>
                                <img class='initial' src="https://images.lyra.site/keyStore.png" />
                                <img class='hover' src="https://images.lyra.site/keyStore-hover.png" />
                            </div>
                        </div>
                        <p>Keystore</p>
                    </div>
                </div>
            </div>

            <!-- 助记词解锁 -->
            <div class="container" v-if="step == 'z1'">
                <h3 class="row1-col1">导入钱包</h3>
                <p class="row1-col2">输入助记词（SEED）来导入账户，或<span @click="select(1)">返回</span></p>
                
                <div>
                    <textarea class="textarea" rows="5" v-model="secretTxt2" @keyup="unlockBtn();enterValue('mnemonic');" @change="unlockBtn();enterValue('mnemonic');" ></textarea>
                </div>
                <div class="row2-col1">您的助记词（SEED）是创建帐户时15个单词，每个单词使用空格区分</div>
                <div class="foot-btn1" v-if="btnZ2 == 1" @click="select('z2')">继续</div>
                <div class="foot-btn1 btn_none" v-if="btnZ2 != 1">继续</div>
            </div>

            <div class="container" v-if="step == 'z2'">
                <h3 class="row1-col1">导入钱包</h3>
                <p class="row1-col2">设置用户名和密码以保护您的账户，或<span @click="select(1)">返回</span></p>
                <div class="row3-col1">
                    <div class="enterTxt" :class="{'enterTxtFocus': userNameFocusS}">
                        <span @click="putStatue('span', 0)">用户名/地址</span>
                        <input class="put-focus auth-input" type="text" maxlength="20" v-model="userName" autocomplete="off" :readonly=!userNameFocusS @focus="putStatue('userName', true)" @blur="putStatue('userName', false)" @keyup="enterValue('userName');unlockBtn();" @change="enterValue('userName');unlockBtn();" />
                        <ul v-if="userName && userName.length<5">
                            <li class="direction"></li>
                            <li>用户名长度至少5位以上</li>
                        </ul>
                    </div>
                </div>

                <div class="row3-col1">
                    <div class="enterTxt" :class="{'enterTxtFocus': password1FocusS}">
                        <span @click="putStatue('span', 1)">请输入密码（8位及以上）</span>
                        <input class="put-focus auth-input" :type=passwordType1 v-model="password1" autocomplete="off" :readonly=!password1FocusS @focus="putStatue('password1', true)" @blur="putStatue('password1', false)" @keyup="enterValue('password1');unlockBtn();" @change="enterValue('password1');unlockBtn();" />
                        
                        <img class="label-light" v-if="passwordType1 == 'password'" @click="passwordIsShow('passwordType1')" src="https://images.lyra.site/show.svg">
                        <img class="" v-if="passwordType1 == 'text'" @click="passwordIsShow('passwordType1')" src="https://images.lyra.site/hide.svg">
                        <ul v-if="passwordSecurity>=0 && passwordSecurity<=2">
                            <li class="direction"></li>
                            <li>密码至少包含(大写、小写、数字、特殊符号)中的任意三种</li>
                        </ul>
                    </div>
                    <div class="row3-cols2">
                        <div v-for="(item,index) in passwordTotalStrength" :key="index" :class="item.status"></div>
                    </div>
                </div>
                
                <div class="row3-col1">
                    <div class="enterTxt" :class="{'enterTxtFocus': password2FocusS}">
                        <span @click="putStatue('span', 2)">请确认密码</span>
                        <input class="put-focus auth-input" :type=passwordType2 v-model="password2" autocomplete="off" :readonly=!password2FocusS @focus="putStatue('password2', true)" @blur="putStatue('password2', false)" @keyup="enterValue('password2');unlockBtn();" @change="enterValue('password2');unlockBtn();" />
                        
                        <img class="label-light" v-if="passwordType2 == 'password'" @click="passwordIsShow('passwordType2')" src="https://images.lyra.site/show.svg">
                        <img class="" v-if="passwordType2 == 'text'" @click="passwordIsShow('passwordType2')" src="https://images.lyra.site/hide.svg">
                        <ul v-if="password2 && (password1 != password2)">
                            <li class="direction"></li>
                            <li>两次密码不一致</li>
                        </ul>
                    </div>
                </div>
                <div class="foot-btn1" v-if="btnZ1 == 1" @click="unlock()">继续</div>
                <div class="foot-btn1 btn_none" v-if="btnZ1 == 0">继续</div>
            </div>

            <!-- keyStore解锁 -->
            <div class="container" v-if="step == 'k1'">
                <h3 class="row1-col1">导入钱包</h3>
                <p class="row1-col2">上传keystore文件以导入钱包，或<span @click="select(1)">返回</span></p>
                <div class="row4-col1" id="drop" v-if="secretStatus == 1 && filesStatus == 0">
                    <div class="row4-col1-head"><img src="https://images.lyra.site/keyDownload.svg" /></div>
                    <p>将keystore文件拖入，或</p>
                    <div class="row4-col1-col"><span @click="upload()">点击上传</span></div>
                </div>
                <div class="row4-col1" v-if="secretStatus == 1 && filesStatus == 1">
                    <div class="row4-col1-col2">
                        <span :class="{'row4-col1-col2-c': deleteFileStatus != 0}" >
                            <img class="row4-col1-col2-s" v-if="deleteFileStatus == 0" src="https://images.lyra.site/success.svg" alt="">
                            <img v-if="deleteFileStatus != 0" src="https://images.lyra.site/clos.svg" alt="">
                            <!-- <em class="iconfont row4-col1-col2-s" v-if="deleteFileStatus == 0">&#xe61d;</em> -->
                            <!-- <em class="iconfont " v-if="deleteFileStatus != 0" >&#xe608;</em> -->
                            {{fileName}}
                        </span>
                    </div>
                    <div class="row4-col1-col">重新拖入，或<span @click="upload()">重新上传</span></div>
                </div>
                <div class="row4-error" v-if="deleteFileStatus == 2">
                    错误 - keystore有误，请重新上传
                    <!-- <span class="iconfont" @click="closeErrorFileTip()">&#xe608;</span> -->
                    <img class="" @click="closeErrorFileTip()" src='https://images.lyra.site/closf.svg'>
                    <label>{{errorFileTime}}s</label>
                </div>
                <input id="upload" type="file" style="display: none" @change="addFile($event)"  />
                <div v-if="secretStatus == 2">
                    <textarea class="textarea textarea2" placeholder="请复制您的Keystore 文件内容" rows="5" v-model="secretTxt1"  @keyup="unlockBtn()" @change="unlockBtn()"></textarea>
                </div>
                <div class="row4-col2" v-if="secretStatus == 1"><span @click="secretType(2)">手动输入</span></div>
                <div class="row4-col2" v-if="secretStatus == 2"><span @click="secretType(1)">上传KeyStore文件</span></div>
                <div class="row3-col1">

                    <div class="enterTxt" :class="{'enterTxtFocus': userNameFocusS}">
                        <span @click="putStatue('span', 0)">用户名/地址</span>
                        <input class="put-focus auth-input" type="text" maxlength="20" v-model="userName" autocomplete="off" :readonly=!userNameFocusS @focus="putStatue('userName', true)" @blur="putStatue('userName', false)" @keyup="enterValue('userName');unlockBtn();" @change="enterValue('userName');unlockBtn();" />
                        <ul v-if="userName && userName.length<5">
                            <li class="direction"></li>
                            <li>用户名长度至少5位以上</li>
                        </ul>
                    </div>
                </div>
                <div class="row3-col1">
                    <div class="enterTxt" :class="{'enterTxtFocus': password1FocusS}">
                        <span @click="putStatue('span', 1)">请输入密码（8位及以上）</span>
                        <input class="put-focus auth-input" :type=passwordType1 v-model="password1" autocomplete="off" :readonly=!password1FocusS @focus="putStatue('password1', true)" @blur="putStatue('password1', false)" @keyup="enterValue('password1');unlockBtn();" @change="enterValue('password1');unlockBtn();" />
                        
                        <img class="label-light" v-if="passwordType1 == 'password'" @click="passwordIsShow('passwordType1')" src='https://images.lyra.site/show.svg'>
                        <img class="" v-if="passwordType1 == 'text'" @click="passwordIsShow('passwordType1')" src='https://images.lyra.site/hide.svg'>
                        <ul v-if="password2 && (password1 != password2)">
                            <li class="direction"></li>
                            <li>密码至少包含(大写、小写、数字、特殊符号)中的任意三种</li>
                        </ul>
                    </div>
                </div>
                <div class="foot-btn1" v-if="btnK1 == 1" @click="unlock()">继续</div>
                <div class="foot-btn1 btn_none" v-if="btnK1 == 0">继续</div>
            </div>

            <!-- 导入成功 -->
            <div class="container2" v-if="step3Status">
                <div class="container2-main" >
                    <div class="container2-main-head">
                        <img @click="mnemonicTip(false)" src="https://images.lyra.site/clos.svg" alt="">
                    </div>
                    <div class="container2-main-col1">
                        <div>
                            <img v-if="waringFlag" src="https://images.lyra.site/waring.png" />
                            <img v-if="!waringFlag" src="https://images.lyra.site/waring-hover.png" />
                        </div>
                    </div>
                    <h3 class="container2-main-col2">解锁成功</h3>
                    <div class="container2-main-foot">
                        <div class="container2-main-foot-btn" @mouseover='changeWaring(false)' @mouseout='changeWaring(true)' @click="mnemonicTip(false)">确认</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import service from "../../../utils/service";
import regular from "../../../utils/regular";
import xtar from "../../../utils/xtarUtil";
import { pubSub } from "../../../watch/index";
import { User } from "../../../utils/user";
import load from "../../../utils/loading";
export default {
    name: 'XtarUnlock',
    data(){
        return {
            //
            step: 1,
            //用户名
            userName: '',
            //密码
            password1: '',
            //确认密码
            password2: '',
            //密码隐藏/显示
            passwordType1: 'password',
            passwordType2: 'password',
            //密码输入框图标状态
            passwordStatus1: 0,
            passwordStatus2: 0,
            //按钮状态
            btnZ1: 0,
            btnZ2: 0,

            btnK1: 0,
            //上传文件
            fileName: null,
            files: null,
            deleteFileStatus: 1,
            errorFileTime: 30,
            errorInterval: null,
            //上传文件状态
            filesStatus: 0,
            //密钥库文件 1：上传txt文件， 2：输入json
            secretStatus: 1,
            //助记词
            mnemonicWord: [],
            //密钥库文件: 输入框
            secretTxt1: null,
            //助记词： 输入框
            secretTxt2: null,
            step3Status: false,
            account: null,
            unreally_account: null,


            userNameFocusS: false,
            password1FocusS: false,
            password2FocusS: false,

            //密码强度
            passwordTotalStrength: [
                { status: '' },
                { status: '' },
                { status: '' },
                { status: '' }
            ],
            //密码安全度
            passwordSecurity: -1,

            mnemonicBtnSet: null,
            privateKey: null,

            // waring图片默认和划过标识
            waringFlag: true
        }
    },
    created(){

    },
    mounted() {
        
    },
    methods: {
        init(){
            this.setPasswordColor();
        },
        //切换解锁方式
        select(step){
            this.step = step;
            if(step == 'k1'){
                this.keyDrop();
            }
            if(step != 'z2'){
                this.initInfo();
            }
        },
        //
        goTo(path){
            this.router.navigateByUrl(path);
        },
        //上传文件
        upload(){
            this.deleteFIle();
            document.getElementById('upload').click();
        },
        addFile(event){
            let fil = event.target.files[0];
            console.log(fil)
            if(fil.size && fil.size<(1 * 1024 * 1024) ){
                let reader = new FileReader();
                if(fil.type.indexOf("text") == 0) { 
                    this.deleteFileStatus = 0;
                }else{
                    this.deleteFileStatus = 2;
                    this.errorFileInterval();
                }
                reader.readAsDataURL(fil); 
                reader.onload = (e)=>{ 
                    this.fileName = this.setFileName(fil.name); 
                    if(this.deleteFileStatus == 0){
                        this.files = atob(reader.result.replace('data:text/plain;base64,', ''));
                    }
                    
                    this.filesStatus = 1;
                    this.unlockBtn();
                };
            }
        },
        //上传文件名过长，中间显示省略号
        setFileName(name){
            let newName = '';
            if(name.length >= 30){
                newName = name.slice(0, 10) + '...' + name.slice(name.length-8, name.length);
            }else{
                newName = name;
            }
            return newName;
        },
        
        deleteFIle(){
            this.fileName = '';
            this.files = '';
            document.getElementById('upload').value = '';
            this.filesStatus = 0;
        },
        errorFileInterval(){
            clearInterval(this.errorInterval);
            this.errorFileTime = 30;
            this.errorInterval = setInterval(()=>{
                if(this.errorFileTime > 0){
                    this.errorFileTime--;
                }else{
                    clearInterval(this.errorInterval);
                    this.closeErrorFileTip();
                }
            },1000)
        },
        closeErrorFileTip(){
            this.deleteFileStatus = 1;
        },

        secretType(type){
            this.secretStatus = type;
            this.unlockBtn();
        },
        //导入成功浮动框
        mnemonicTip(type){
            this.step3Status = type;
        },
        //解锁
        unlock(){
            if(this.step == 'k1'){
                //keystore解锁
                // console.log('keystore解锁')
                if(this.secretStatus == 1){ this.account = xtar.load(this.files, this.password1); }
                else{ this.account = xtar.load(this.secretTxt1, this.password1); }
                

                if(this.account && this.account.status && this.account.status != 0){ 
                    load.tipErrorShow('解锁失败，请确认keyStroe和密码是否匹配');
                    return
                }
            }else if(this.step == 'z2'){
                //助记词解锁
                let mnemonicEntropy = xtar.mnemonicToEntropy(this.secretTxt2)
                this.account = xtar.create(2, this.password1, this.secretTxt2);
                this.unreally_account = xtar.create(3, this.password1, mnemonicEntropy);
            }
            this.privateKey = this.account.msg.crypto.privateKey;
            let keyStore;
            let unreally;
            if(this.files){ keyStore = this.files }
            else if(this.secretTxt1){ keyStore = this.secretTxt1 }
            else if(this.secretTxt2){ 
                keyStore = this.account.msg.toJson(); 
                unreally = this.unreally_account.msg.toJson();
            }

            let account = {
                name: this.userName,
                type: '',
                address: JSON.parse(keyStore).address,
                keyStore: '',
            }
            
            if(keyStore){
                if(this.step == 'k1'){
                    account.type = 'key';
                    account.keyStore = JSON.parse(keyStore);
                }else if(this.step == 'z2'){
                    account.type = 'mnemonic';
                    account.keyStore = JSON.parse(unreally);
                }
            }
            if((this.account && this.account.status == 0) || (this.unreally_account && this.unreally_account.status == 0)){
                User.addLocalKey(account);
                User.setItem('user_login_keystore', JSON.stringify(account));
                User.setItemlocalCrypt('publicKey', this.account.msg.crypto.publicKey);
                User.setPriDate(this.privateKey);
                this.login();
            }
        },
        
        //登录
        login(){
            load.loadingShow();
            service.newLogin({user: this.account.msg.address}).then(res=>{
                load.hide();
                if(res.status == 0){
                    pubSub.resetData();
                    User.setObject('account',res.data);
                    load.tipSuccessShow('解锁成功');
                    this.$emit("close",false)
                }else{
                    load.tipErrorShow('解锁失败,请重试');
                }
            })
        },
        //获取hash
        getUrlParam(name){
            var reg=new RegExp('(^|&)'+name+'=([^&]*)(&|$)');
            var result=window.location.search.substr(1).match(reg);
            return result ? decodeURIComponent(result[2]):null; 
        },
        //解锁按钮状态管理
        unlockBtn(){
            if(this.step == 'z1'){  // 助记词按钮状态
                clearTimeout(this.mnemonicBtnSet)
                this.mnemonicBtnSet = setTimeout(()=>{
                    if(this.secretTxt2 && this.secretTxt2.split(' ').length == 15){ 
                        this.btnZ2 = xtar.validateMnemonic(this.secretTxt2) ? 1 : 2 ;
                        if(this.btnZ2 == 2){ load.tipErrorShow('这不是有效的助记词')}
                    }
                    else{ this.btnZ2 = 0; }
                }, 1000)
            }else if(this.step == 'z2'){    // 助记词填写用户名密码状态
                if(this.password1 && this.password1.length >= 8 && this.passwordSecurity >=3 && this.password2 && (this.password1 === this.password2) && this.userName && this.userName.length >= 5){
                    this.btnZ1 = 1;
                }else{ this.btnZ1 = 0; }
            }else if(this.step == 'k1'){    // 上传/输出keyStore按钮状态
                if(this.secretStatus == 1){
                    if(this.files && this.password1 && this.password1.length >= 8 && this.userName && this.userName.length >= 5){ this.btnK1 = 1; }
                    else{ this.btnK1 = 0; }
                }else if(this.secretStatus == 2){
                    if(this.secretTxt1 && this.password1 && this.password1.length >= 8 && this.userName && this.userName.length >= 5){ this.btnK1 = 1; }
                    else{ this.btnK1 = 0; }
                }
            }
        },
        //初始化基本信息
        initInfo(){
            let file = document.getElementById('upload');
            if(file && file.value){ file.value = ''; }

            this.userName = '';
            this.password1 = '';
            this.password2 = '';
            this.passwordType1 = 'password';
            this.passwordType2  = 'password';
            this.passwordStatus1 = 0;
            this.passwordStatus2 = 0;
            this.btnZ1 = 0;
            this.btnZ2 = 0;

            this.btnK1 = 0;
            this.fileName = '';
            this.files = '';
            this.deleteFileStatus = 1;
            this.errorFileTime = 30;
            this.filesStatus = 0;
            this.secretStatus = 1;
            //助记词
            this.mnemonicWord = [];
            this.secretTxt1 = '';
            this.secretTxt2 = '';

            this.step3Status = false;

        },
        //隐藏/显示密码
        passwordIsShow(type){
            if(type == 'passwordType1'){
                this.passwordType1 = this.passwordType1 == 'password'? 'text' : 'password';
                this.passwordStatus1 = this.passwordStatus1 == 0 ? 1 : 0;
            }else if(type == 'passwordType2'){
                this.passwordType2 = this.passwordType2 == 'password'? 'text' : 'password';
                this.passwordStatus2 = this.passwordStatus2 == 0 ? 1 : 0;
            }   
        },
        
        //输入框动画
        putStatue(type, status){
            if(type == 'span'){
                let dom = document.getElementsByClassName('put-focus');
                dom[status].focus();
            }else{
                if(type == 'userName'){ this.userNameFocusS = this.userName ? true : status } 
                else if(type == 'password1'){ this.password1FocusS = this.password1 ? true : status }
                else if(type == 'password2'){ this.password2FocusS = this.password2 ? true : status }
            }
        },
        enterValue(type){
            if(type == 'userName'){
                this.userName = regular.stringAndNumber(this.userName);
            }
            else if(type == 'password1'){
                this.passwordL()
            }
            else if(type == 'mnemonic'){
                let secretTxt2 = regular.stringKong(this.secretTxt2);
                this.secretTxt2 = regular.kongGe(secretTxt2);
            }
        },

        //判断密码强度
        passwordL(){
            this.passwordSecurity = regular.verificationPassword(this.password1);
            this.setPasswordColor();
        },
        // 初始化密码强度条颜色
        resPasswordTotal(){
            this.passwordTotalStrength = [
                {status:''},
                {status:''},
                {status:''},
                {status:''}
            ]
        },
        //设置密码强度条颜色
        setPasswordColor(){
            this.resPasswordTotal();
            for(let i=0; i<this.passwordTotalStrength.length; i++){
                if(i == 0 && this.passwordSecurity >= 0){ this.passwordTotalStrength[i].status = 'passwordColor0'}
                if(i == 1 && this.passwordSecurity >= 2){ this.passwordTotalStrength[i].status = 'passwordColor0'}
                if(i == 2 && this.passwordSecurity >= 3){ this.passwordTotalStrength[i].status = 'passwordColor1' }
                if(i == 3 && this.passwordSecurity >= 4){ this.passwordTotalStrength[i].status = 'passwordColor2' }
            }
        },

        //keyStore拖拽文件
        keyDrop(){
            let _this = this;
            setTimeout(()=>{
                document.ondrop = function(e){
                    e.preventDefault();
                    drops(e);
                }
                document.ondragover = function(e){
                    e.preventDefault();
                }
                let drops = function(e){
                    // 得到拖拽过来的文件
                    var dataFile = e.dataTransfer.files[0];
                    // FileReader实例化
                    var fr = new FileReader();
                    // 异步读取文件
                    fr.readAsText(dataFile);
                    // 读取完毕之后执行
                    fr.onload = function(){
                        // 获取得到的结果
                        let data = fr.result;
                        try{
                            let keyStore = JSON.parse(data);
                            _this.deleteFileStatus = 0;
                            _this.filesStatus = 1;
                            _this.fileName = "上传完成"; //'上传完成';
                            _this.files = fr.result;
                        }
                        catch(error){
                            _this.deleteFileStatus = 2;
                            _this.filesStatus = 1;
                            _this.fileName = "这不是有效的钱包";//'这不是有效的钱包';
                            _this.files = null;
                            _this.errorFileInterval();
                        }
                        _this.unlockBtn();
                    }
                }
            }, 100);
        },

        changeWaring(flag){
            this.waringFlag = flag;
        }
    },
}
</script>


<style lang="scss" scoped>
@import '../../../lib/theme/unlock.scss';
</style>

