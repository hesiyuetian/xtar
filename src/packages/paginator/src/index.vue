<template>
  <div class="april-paginator-content" v-if="totalRow > 10" :style="{'text-align': textAlign}">
    <div class="paginator">
      <div
        class="first-page page"
        @click="setCurrentPage(1)"
      >{{locale == 'zh' ? '首页' : 'First Page'}}</div>

      <div
        class="icon"
        @click="setCurrentPage(currentPage-1)"
        :style="{'disabled': currentPage == 1 ,'cursor':currentPage!=1?'pointer':''}"
      >
        <img src="https://github.com/hesiyuetian/plug-img/blob/master/down.png?raw=true" alt />
      </div>

      <div
        class="page"
        v-for="(item,index) in middlePages"
        :key="index"
        :class="{ 'current': item === currentPage }"
        @click="setCurrentPage(item)"
      >{{item}}</div>

      <div
        class="icon"
        @click="setCurrentPage(currentPage+1)"
        :style="{'disabled':currentPage==totalPage,'cursor':currentPage!=totalPage?'pointer':''}"
      >
        <img src="https://github.com/hesiyuetian/plug-img/blob/master/up.png?raw=true" alt />
      </div>

      <div
        class="last-page page"
        @click="setCurrentPage(totalPage)"
      >{{locale == 'zh' ? '尾页': 'Last Page'}}</div>

      <div class="current-page">
        <input type="number" @keydown="onInputKeyDown($event)" v-model="changeCurrentPage" />
        <span @click="jumpToChangeCurrentPage()">{{locale == 'zh' ? '跳转': 'Go to'}}</span>
      </div>
      <!-- <div class="page-size">****{{totalRow}}****</div> -->
      <div class="page-size">
        {{locale == 'zh' ? '每页显示': 'Per Page'}}
        <input
          type="number"
          v-model="changePageSize"
          @keyup="setPageSize()"
        />
        {{locale == 'zh' ? '行': 'Row'}}
      </div>
    </div>
  </div>
</template>


<script>
import { mapActions } from "vuex";
// import {
//   A_SET_NUMBER
// } from "../../../store/exchang/types";
export default {
  name: "XtarPaginator",
  data() {
    let self = this;
    return {
      totalPage: "",
      pageRange: 5,
      middlePages: [],
      changePageSize: "",
      changePageSizeDebounce: "",
      changeCurrentPage: "",

      currentPage: 1,
      pageSizes: 10
    };
  },
  props: {
    currentPages: {
      type: [Number, String],
      default: 1
    },
    pageSize: {
      type: [Number, String],
      default: 10
    },
    totalRow: {
      type: [Number, String],
      default: 100
    },
    textAlign: {
      type: String,
      default: "right"
    },
    locale: {
      type: String,
      default: "zh"
    }
  },
  watch: {
    currentPages: {
      immediate: true,
      handler: function() {
        // console.log(1231231212312312,this.currentPage)
        this.currentPage = Number(this.currentPages);
        this.init();
      }
      // this.currentPage = this.currentPages;
    },
    pageSize: {
      immediate: true,
      handler: function() {
        // console.log(1231231212312312,this.pageSize)
        this.pageSizes = Number(this.pageSize);
        // this.init();
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    // ...mapActions([A_SET_NUMBER]),
    init() {
      this.setTotalPage();
      this.setMiddlePage();
    },

    setTotalPage() {
      this.totalPage = Math.ceil(this.totalRow / this.pageSizes);
    },

    setMiddlePage() {
      this.middlePages = [];
      for (
        let i =
          this.currentPage - this.pageRange < 1
            ? 1
            : this.currentPage - this.pageRange;
        i <= this.currentPage + this.pageRange && i <= this.totalPage;
        i++
      ) {
        this.middlePages.push(i);
      }

      // console.log(this.middlePages,'this.middlePages',this.currentPage)
    },

    jumpToChangeCurrentPage() {
      // this.A_SET_NUMBER(2)
      this.$store.commit('A_SET_NUMBER', 15)
      if (
        this.changeCurrentPage &&
        this.changeCurrentPage > 0 &&
        this.changeCurrentPage <= this.totalPage
      ) {
        this.currentPage = Number(this.changeCurrentPage);
        // this.setMiddlePage();
        // this.onCurrentPageChange.emit(this.currentPage);
        this.init();
        this.$emit("changePage", this.currentPage);
      }
    },

    //输入限制 onkeydown
    onInputKeyDown(event) {
      let inputKey = (event && event.key) || "0";
      if (
        [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "Backspace",
          "ArrowLeft",
          "ArrowRight",
          "Tab",
          "Delete"
        ].indexOf(inputKey) === -1
      ) {
        event.preventDefault();
        return;
      }
    },

    setCurrentPage(i) {
      if (i > 0 && i <= this.totalPage) {
        this.currentPage = i;
        // this.onCurrentPageChange.emit(this.currentPage);
        this.$emit("changePage", this.currentPage);
        // console.log(this.currentPage,'this.currentPage12132312')
        this.setMiddlePage();
      }
    },

    setPageSize() {
      //因为修改了每页显示行数，所以需跳转到第一页
      this.changeCurrentPage = 1;
      clearTimeout(this.changePageSizeDebounce);
      this.changePageSizeDebounce = setTimeout(() => {
        this.currentPage = 1;
        this.pageSizes = this.changePageSize;
        // this.setCurrentPage(1);
        this.init();
        // this.onPageSizeChange.emit(this.changePageSize || 10);
        this.$emit("changePageSize", this.changePageSize || 10);
      }, 500);
    }
  }
};
</script>

<style lang="scss" scoped>
.april-paginator-content {
  width: 100%;
}
.paginator {
  overflow: hidden;
  padding: 10px 20px;
  display: inline-block;

  .page {
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    margin: 0 5px;
    float: left;
    font-size: 12px;
    border-radius: 2px;
    transition: background 500ms;
    &:hover {
      cursor: pointer;
    }
  }

  .icon {
    width: 24px;
    height: 24px;
    line-height: 24px;
    margin: 0 5px;
    float: left;
    text-align: center;
    img {
      width: 20px;
      // height: 15px;
    }
  }

  .first-page,
  .last-page {
    width: auto;
    span {
      font-size: 14px;
    }
    background-color: rgba(0, 0, 0, 0) !important;
  }
  .first-page {
    margin-left: 0;
    span {
      margin-left: 25px;
    }
  }
  .last-page span {
    margin-right: 25px;
  }

  .current {
    background: #004ff9 !important;
    color: #fff;
  }
  .current-page {
    float: left;
    margin-left: 20px;
    input {
      width: 50px;
      height: 24px;
      border: none;
      outline: none;
      border-radius: 2px;
      margin: 0 10px;
      text-align: center;
      overflow: hidden;
      border: 1px solid #ccc;
    }
    span {
      cursor: pointer;
    }
  }
  .page-size {
    float: right;
    margin-left: 30px;
    input {
      width: 40px;
      height: 24px;
      border: none;
      outline: none;
      border-radius: 2px;
      margin: 0 10px;
      text-align: center;
      border: 1px solid #ccc;
      overflow: hidden;
    }
  }
}
.connect_l {
  text-align: left;
}
.connect_c {
  text-align: center;
}
.connect_r {
  text-align: right;
}
</style>
