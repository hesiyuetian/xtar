<template>
  <div id="april-pc-data-time-s" ref="aprilData" tabindex="2" @focus="infocus()" @blur="inblur()">
    <input
      type="text"
      placeholder="输入日期"
      readonly
      disabled
      v-model="date"
      :style="{'width':width+'px','height':height+'px','left':left+'px','color':color}"
    />
    {{G_GET_NUMBER}}
    <img
      src="https://github.com/hesiyuetian/plug-img/blob/master/date.png?raw=true"
      class="icon-calendar"
      alt
    />
    <img
      src="https://github.com/hesiyuetian/plug-img/blob/master/cancel.png?raw=true"
      class="icon-quxiao"
      alt
      @click="cancel"
    />
    <!-- <i class='iconfont icon-calendar'>&#xe7d6;</i> 
    <i class='iconfont icon-quxiao1' @click='cancel'>&#xe631;</i>-->
    <div
      class="canlender"
      id="canlender"
      v-if="dis"
      @click.stop="infoc()"
      :style="{'background':background,'top': height+10 +'px'}"
    >
      <div class="pc-data-time-s-g" :style="{'top': iconTop+'px'}"></div>
      <header class="qcfd">
        <div class="f-fl">
          <img
            src="https://github.com/hesiyuetian/plug-img/blob/master/down.png?raw=true"
            class="down icon"
            alt
            @click="yeared('pre')"
          />
          <img
            src="https://github.com/hesiyuetian/plug-img/blob/master/left.png?raw=true"
            class="left icon"
            alt
            @click="monted('pre')"
          />
          <!-- <i @click='yeared("pre")' class='iconfont'>&#xe604;</i>
          <i  @click='monted("pre")' class='iconfont'>&#xe602;</i>-->
        </div>
        <span v-if="locale === 'en'">{{year}}&nbsp;&nbsp;&nbsp;&nbsp;{{month|changEn}}</span>
        <span v-else>{{year}} 年 {{month}} 月-{{G_GET_NUMBER}}</span>
        <div class="f-fr">
          <img
            src="https://github.com/hesiyuetian/plug-img/blob/master/right.png?raw=true"
            class="right icon"
            alt
            @click="monted('pro')"
          />
          <img
            src="https://github.com/hesiyuetian/plug-img/blob/master/up.png?raw=true"
            class="up icon"
            alt
            @click="yeared('pro')"
          />
          <!-- <i  @click='monted("pro")' class='iconfont'>&#xe605;</i>
          <i @click='yeared("pro")' class='iconfont'>&#xe606;</i>-->
        </div>
      </header>
      <table class="bgtable">
        <thead>
          <tr>
            <!--汉字表头-->
            <th v-for="(item,index) in daynamearr" :key="index">{{item}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week,i) in wek" :key="i">
            <td
              v-for="(item,ind) in week"
              :key="ind"
              v-if="ind < week.length"
              :class="{'gray': item.prevmonth }"
              @mouseenter="over(i,ind)"
              @mouseleave="leave()"
              @click.stop="setD(item.prevmonth,item.day)"
            >
              <span
                :class="['bgtable-block',(year == defaultYear && month == defaultMonth && defaultDay == item.day && !item.prevmonth) ? 'acts' : null ,
                         toYear == year && toMonth == month && toDay == item.day && !item.prevmonth ? 'today' : null ,
                         defaultI == i && defaultInd == ind && !item.prevmonth ? 'hover' : null ]"
              >{{item.day}}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>

Date.prototype.format = function(fmt) {
    let o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(let k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
};

import { mapGetters } from "vuex";
// import {
//   G_GET_NUMBER
// } from "../../../store/exchang/types";
export default {
  name: "XtarDate",
  data() {
    return {
      date: "",
      daynamearr: ["日", "一", "二", "三", "四", "五", "六"], //星期天数组
      //本月的本期构成
      dayarr: [],
      year: "",
      month: "",
      day: "",
      wek: [], //日历中的数据
      dis: false, //让日历消失

      toYear: new Date().getFullYear(),
      toMonth: new Date().getMonth() + 1,
      toDay: new Date().getDate(),
      defaultYear: "",
      defaultMonth: "",
      defaultDay: "",
      // 划过事件 hover
      defaultI: null,
      defaultInd: null,

      timer: null,
      iconTop: -5
    };
  },
  props: {
    defaultDate: {
      type: String,
      default: new Date().format("yyyy-MM-dd")
    },
    maxDate: {
      type: String,
      default: ""
    },
    minDate: {
      type: String,
      default: ""
    },
    width: {
      type: String,
      default: "200"
    },
    height: {
      type: Number,
      default: 30
    },
    left: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "#606266"
    },
    background: {
      type: String,
      default: "#fff"
    },
    locale: {
      type: String,
      default: "zh"
    },
    isAuthMsp: {
      type: Boolean,
      default: true
    }
    //    changeDate:{
    //        type: Function,
    //        default: ()=>{}
    //    }
  },
  filters: {
    changEn(data) {
      switch (data) {
        case 1:
          return "January";
          break;
        case 2:
          return "February";
          break;
        case 3:
          return "March";
          break;
        case 4:
          return "April";
          break;
        case 5:
          return "May";
          break;
        case 6:
          return "June";
          break;
        case 7:
          return "July";
          break;
        case 8:
          return "August";
          break;
        case 9:
          return "September";
          break;
        case 10:
          return "October";
          break;
        case 11:
          return "November";
          break;
        case 12:
          return "December";
          break;
      }
    }
  },
  watch: {
    dis() {
      if (this.dis) {
        this.reset();
      }
    }
  },
  mounted() {
    window.onresize = _ => {
      clearTimeout(this.timer);
      this.timer = setTimeout(_ => {
        this.listener();
      }, 300);
    };
    this.reset();
  },

  methods: {
    infocus() {
      this.dis = true;
      this.reset();
      this.listener();
    },
    reset() {
      //初始化默认日期
      this.$nextTick(_ => {
        this.date = this.date ? this.date : this.defaultDate;

        this.defaultYear = this.getDateYear(this.date);
        this.defaultMonth = this.getDateMonth(this.date);
        this.defaultDay = this.getDateDay(this.date);
        this.year = this.getDateYear(this.date);
        this.month = this.getDateMonth(this.date);
        this.day = this.getDateDay(this.date);
        (this.daynamearr =
          this.locale === "en"
            ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            : ["日", "一", "二", "三", "四", "五", "六"]),
          this.calculation();
      });
    },
    getDateYear(date) {
      //获取年份
      return new Date(date.replace(/-/g, "/")).getFullYear();
    },
    getDateMonth(date) {
      //获取月份
      return new Date(date.replace(/-/g, "/")).getMonth() + 1;
    },
    getDateDay(date) {
      //获取日
      return new Date(date.replace(/-/g, "/")).getDate();
    },
    maxLimit(day) {
      //最大日期限制
      //false  打开可以选择  true 关闭 不可以选择
      if (this.maxDate) {
        if (this.year > this.getDateYear(this.maxDate)) return true;
        else if (
          this.year <= this.getDateYear(this.maxDate) &&
          this.month > this.getDateMonth(this.maxDate)
        )
          return true;
        else if (day > this.getDateDay(this.maxDate)) {
          if (this.month < this.getDateMonth(this.maxDate)) {
            return false;
          } else {
            return true;
          }
        } else return false;
      } else {
        return false;
      }
    },
    minLimit(day) {
      //最小日期限制
      if (this.minDate) {
        if (this.year < this.getDateYear(this.minDate)) return true;
        else if (this.month < this.getDateMonth(this.minDate)) return true;
        else if (day < this.getDateDay(this.minDate)) {
          if (this.getDateMonth(this.minDate) < this.month) {
            return false;
          } else {
            return true;
          }
        } else return false;
      } else {
        return false;
      }
    },
    calculation() {
      // 初始化配置
      this.dayarr = [];
      this.wek = [];
      //需要知道这个月的第一天是星期几
      var themonth1stday = new Date(this.year, this.month - 1, 1).getDay();
      // console.log(themonth1stday,'本月第一天是周几')
      //本月有多少天，这个月的最后一天就是下个月的最后一天减去一毫秒
      var y = this.month == 12 ? this.year + 1 : this.year; //年份
      var m = this.month == 12 ? 1 : this.month; //月份
      var themonthdaysamount = new Date(new Date(y, m, 1) - 1).getDate();
      // console.log(themonthdaysamount,'计算这个月的天数')
      //上个月有多少天
      var prevmonthlastday = new Date(
        new Date(this.year, this.month - 1, 1) - 1
      ).getDate();
      // console.log(prevmonthlastday,'计算上个月的天数')
      // 上个月在本月的前几天中出现
      while (themonth1stday-- > 0) {
        this.dayarr.unshift({
          day: prevmonthlastday--,
          prevmonth: true
          // "nextmonth": false,
        });
      }
      //本月的日期
      var count = 0;
      while (themonthdaysamount--) {
        this.dayarr.push({
          day: ++count,
          // "prevmonth": false,
          // "nextmonth": false,
          prevmonth: this.maxLimit(count) || this.minLimit(count) ? true : false
        });
      }
      // console.log(this.dayarr,'9988')
      //下个月日期
      var c = 42 - this.dayarr.length;
      var count2 = 1;
      while (c-- > 0) {
        this.dayarr.push({
          day: count2++,
          // "nextmonth":true,
          prevmonth: true
        });
      }
      this.theweek();
    },
    theweek() {
      var _arr = [];
      for (var i = 0; i < 6; i++) {
        var _week = [];
        for (var j = 0; j < 7; j++) {
          _week.push(this.dayarr[i * 7 + j]);
        }
        _arr.push(_week);
      }
      this.wek = _arr;
    },
    yeared(type) {
      if (type == "pre") {
        this.year--;
      } else {
        this.year++;
      }
      this.calculation();
    },
    monted(type) {
      if (type == "pre") {
        if (this.month - 1 <= 0) {
          this.month = 12;
          this.year--;
        } else this.month--;
      } else {
        if (this.month++ < 12) this.month;
        else {
          this.year++;
          this.month = 1;
        }
      }
      this.calculation();
    },
    cancel() {
      this.date = "";
      this.$emit("changeDate", this.date);
    },
    inblur() {
      this.dis = false;
    },
    infoc() {
      // console.log(7777)
      // event.stopPropagation();
      this.dis = true;
    },
    setD(type, val) {
      if (!type) {
        let f = this.year + "-" + this.month + "-" + val;
        this.date = new Date(f).format("yyyy-MM-dd");
        this.$emit("changeDate", this.date);
        // this.changeDate(this.date)
        // this.dis = false;
        this.$refs.aprilData.blur();
      }
    },
    over(i, ind) {
      this.defaultI = i;
      this.defaultInd = ind;
    },
    leave() {
      this.defaultI = null;
      this.defaultInd = null;
    },
    listener() {
      // try{
      //     let _h = $(window).height() - $("#april-pc-data-time-s").offset().top - $(document).scrollTop();
      //     if( _h < 380 && this.isAuthMsp){
      //         this.height = -360;
      //         this.iconTop = 329;
      //     }else{
      //         this.height = 30;
      //         this.iconTop = -5;
      //     }
      //     console.log(_h,this.height,this.iconTop)
      // }
      // catch(e){
      //     console.log('error')
      // }
    }
  },
  computed: {
    ...mapGetters(["G_GET_NUMBER"])
  },
};
</script>
<style scoped>
@import url("../../../lib/reset.scss");
html,
body {
  font-family: "Microsoft YaHei", "weiruanyahei", Tahoma, SimSun;
  font-size: 16px;
  text-align: left;
  font-weight: 500;
}
ul,
ol {
  list-style: none;
}
img {
  border: 0;
}
/*input,select,textarea{outline:0;}*/
textarea {
  resize: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
th,
strong,
var,
em {
  font-weight: normal;
  font-style: normal;
}
a {
  text-decoration: none;
}
.f-fl {
  float: left;
}
.f-fr {
  float: right;
}
#april-pc-data-time-s {
  height: 30px;
  position: relative;
  display: inline-block;
  /* margin: 700px; */
}
#april-pc-data-time-s .pc-data-time-s-g {
  width: 8px;
  height: 8px;
  background: #fff;
  transform: rotate(45deg);
  -webkit-transform-origin: center bottom;
  transform-origin: center bottom;
  position: absolute;
  top: -5px;
  z-index: 99;
}
#april-pc-data-time-s input {
  border: 1px solid #d9d9d9;
  height: 100%;
  color: #606266;
  border-radius: 5px;
  text-indent: 35px;
  cursor: default;
}
#april-pc-data-time-s .icon-quxiao {
  top: 4px;
  position: absolute;
  right: 6px;
  font-size: 21px;
  display: inline-block;
  width: 24px;
  color: rgb(96, 98, 102);
}
#april-pc-data-time-s .icon-calendar {
  top: 3px;
  position: absolute;
  left: 6px;
  font-size: 23px;
  display: inline-block;
  width: 24px;
  color: rgb(96, 98, 102);
}
#april-pc-data-time-s input:focus {
  outline: none;
  border: #87c6f9 1px solid;
  box-shadow: 0 0 8px rgba(103, 166, 217, 1);
}
#april-pc-data-time-s .canlender {
  width: 260px;
  height: auto;
  padding: 0 15px 15px;
  border-radius: 6px;
  border: 1px solid #eee;
  position: absolute;
  left: 0;
  top: 40px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 99999;
}
#april-pc-data-time-s header {
  width: 100%;
  line-height: 54px;
  font-size: 14px;
  text-align: center;
  color: #606266;
  position: relative;
}
#april-pc-data-time-s .icon {
  top: 4px;
  position: absolute;
  top: 14px;
  font-size: 21px;
  display: inline-block;
  width: 24px;
}
#april-pc-data-time-s .down {
  left: 0px;
}
#april-pc-data-time-s .left {
  left: 18px;
}
#april-pc-data-time-s .right {
  right: 18px;
}
#april-pc-data-time-s .up {
  right: 0px;
}
#april-pc-data-time-s table {
  border-collapse: collapse;
  width: 100%;
  font-size: 12px;
}

#april-pc-data-time-s table.bgtable thead tr th {
  line-height: 40px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

#april-pc-data-time-s table.bgtable tbody tr td {
  line-height: 37px;
  box-sizing: border-box;
  /* border: 1px solid #ccc; */
  text-align: right;
  vertical-align: top;
  text-align: center;
  /* background: #eee; */
  /* padding: 4px; */
}
#april-pc-data-time-s table.bgtable tbody tr td .bgtable-block {
  width: 30px;
  line-height: 30px;
  display: inline-block;
  text-align: center;
  /* background: #fff */
}
#april-pc-data-time-s table.bgtable tbody tr td.gray {
  color: #c0c4cc;
  /* background: #DDDDDD; */
}
#april-pc-data-time-s table.bgtable tbody tr td .today {
  color: #409eff;
}
#april-pc-data-time-s table.bgtable tbody tr td .hover {
  color: #409eff;
}
#april-pc-data-time-s table.bgtable tbody tr td .acts {
  color: #fff;
  background-color: #409eff;
  border-radius: 50%;
}

.el-alert {
  width: 100%;
  padding: 8px 16px;
  margin: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
  background-color: #fff;
  overflow: hidden;
  opacity: 1;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-transition: opacity 0.2s;
  transition: opacity 0.2s;
}
.el-alert.is-center {
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.el-alert--success {
  background-color: #f0f9eb;
  color: #67c23a;
}
.el-alert--success .el-alert__description {
  color: #67c23a;
}
.el-alert--info {
  background-color: #f4f4f5;
  color: #909399;
}
.el-alert--info .el-alert__description {
  color: #909399;
}
.el-alert--warning {
  background-color: #fdf6ec;
  color: #e6a23c;
}
.el-alert--warning .el-alert__description {
  color: #e6a23c;
}
.el-alert--error {
  background-color: #fef0f0;
  color: #f56c6c;
}
.el-alert--error .el-alert__description {
  color: #f56c6c;
}
.el-alert__content {
  display: table-cell;
  padding: 0 8px;
}
.el-alert__icon {
  font-size: 16px;
  width: 16px;
}
.el-alert__icon.is-big {
  font-size: 28px;
  width: 28px;
}
.el-alert__title {
  font-size: 13px;
  line-height: 18px;
}
.el-alert__title.is-bold {
  font-weight: 700;
}
.el-alert .el-alert__description {
  font-size: 12px;
  margin: 5px 0 0;
}
.el-alert__closebtn {
  font-size: 12px;
  color: #c0c4cc;
  opacity: 1;
  position: absolute;
  top: 12px;
  right: 15px;
  cursor: pointer;
}
.el-alert__closebtn.is-customed {
  font-style: normal;
  font-size: 13px;
  top: 9px;
}
.el-alert-fade-enter,
.el-alert-fade-leave-active {
  opacity: 0;
}
</style>
