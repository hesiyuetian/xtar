<template>
    <div class='dialog-pwd'>
        <div class='dialog-pwd-zhan'></div>
        <div class='dialog-pwd-con f-center'>
            <img class='dialog-pwd-con-close f-cursor' @click='close()' src="https://images.lyra.site/xtar-icon-close.svg">
            <div class='dialog-pwd-con-item' :class="{'f-enterTxtFocus': pwdFlag}">
                <span class='f-up-title'>请输入账户密码</span>
                <input class='bottom auth-input' type="password" autocomplete="off" v-model="pwd" :readonly=!pwdFlag @focus='focusInput(true)'
                    @blur='focusInput()'>
            </div>

            <div class='dialog-pwd-con-btn'>
                <div class='f-cursor close' @click="close()">返回</div>
                <div class='btn' :class="{'dialog-pwd-con-btn-dis f-cursor-not': !pwd,'f-cursor': pwd}"
                    @click='sub_send()'>确定</div>
            </div>
        </div>
    </div>
</template>

<script>
import regular from "../../../utils/regular";
export default {
    name: 'XtarPwd',
    data(){
        return {
            pwd: '',
            pwdFlag: false
        }
    },
    props: {
        config: {
            type: Object
        }
    },
    methods: {
        focusInput(flag){
            if (!this.pwd) this.pwdFlag = !!flag
        },
        sub_send(){
            this.config.callbackSure(this.pwd);
        },
        close(){
            this.config.callbackCancel();
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../../../lib/theme/base/pwd.scss';
</style>

