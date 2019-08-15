<template>
  <div class="alert">
    <div class="alert_mask"></div>
    <div class="alert_cont f-center border-box">
      <!-- <i class="iconfont f-cursor close icon_style" @click="close()">&#xe608;</i> -->
        <img class='f-cursor close icon_style' @click='close()' src="https://images.lyra.site/xtar-icon-close.svg">
      <div class="alert_cont_con">
        <div class="alert_cont_con_cons">
          <p class="alert_cont_con_tip">{{config.tip}}</p>
          <p class="alert_cont_con_tips" v-if="config.tipKey">{{config.tipKey}}</p>
        </div>
        <div class="alert_cont_con_btn qcfd f-center-x">
          <div
            class="f-cursor alert_cont_con_btn_left left"
            @click="config.callbackCancel();"
          >返回</div>
          <div
            class="f-cursor alert_cont_con_btn_right right"
            @click="config.callbackSure();"
          >{{config.ok}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "XtarAlert",
  props: {
      config: {
          type: Object
      }
  },
  methods: {
        close(){
            this.config.callbackCancel()
        }
    },
};
</script>

<style lang="scss" scoped>
@import "../../../lib/theme/base/alert.scss";
</style>

