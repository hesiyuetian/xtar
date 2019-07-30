<template>
  	<div
		class="select-box noselect border-box"
		tabindex="1"
		:style="{'line-height': height+'px','height':height+'px'}"
		@focus="dis = true"
		@blur="dis = false"
  	>
    	<span v-if="setLang">{{setLang}}</span>
		<span class="placeholder" v-if="!setLang" :style="{'color': placeholderColor}" >{{placeholder}}</span>
		<i class="iconfont sanjiao_xia down" v-if="dis == false">&#xe600;</i>
		<i class="iconfont sanjiao_xia april-up up" v-if="dis == true">&#xe6bd;</i>
    	<div class="down-box hover_bgColor april-select" v-if="dis" :style="{'top': height+6+'px'}">
			<p	
				v-for="(item,index) in list" :key=index
				:class="{'act': item.val == this.defaultset}"
				@click="sel(item.val,$event)"
			>
				<span v-if="language != 'en'">{{item.zhName}}</span>
				<span v-if="language == 'en'">{{item.enName}}</span>
			</p>
    	</div>
  	</div>
</template>

<script>
    export default {
		name: 'xtarSlide',
        data(){
            return {
				setLang: '',
				dis: false
            }
        },
        props: {
			height: {
				type: [Number,String],
                defalut: 32
			},
            list: {
                type: Array,
                defalut: []
            },
            language: {
                type: String,
                defalut: 'zh'
            },
            defaultset: {
                type: [String,Number],
                defalut:  ''
            },
            placeholder: {
                type: [String,Number],
                defalut:  '请选择'
			},
			placeholderColor: {
                type: String,
                defalut:  '#adada7'
            }
		},
		watch:{
			language(prv,cur){
				this.filter();
			}
		},
        created(){

        },
        mounted(){
            setTimeout(_ => {
				this.filter();
			},500)
        },
        methods: {
            filter(){
				let item = this.list;
				for(let i in item){
					if(this.defaultset !== ''){
						if(item[i].val == this.defaultset)
						return this.setLang = this.language == 'en' ? item[i].enName : item[i].zhName
					}
					// else
					// 	return this.setLang = item[i].name, this.defaultset = item[i].val ;
				}
			},
			sel(val,event){
				event.stopPropagation();
				this.el.nativeElement.querySelector('.select-box').blur();
				this.defaultset = val;
				this.filter();
				this.checkedBack.emit(val);
			}
        }
    }
</script>


<style lang="scss" scoped>
.select-box{
    // float: right;
    width: 100%;
    padding: 0 10px;
    border-radius: 4px;
    // border: 1px solid #d9d9d9;
    position: relative;
    cursor: pointer;
    // font-size: 16px;
    .sanjiao_xia{
        float: right;
        color: #9c9393;
        // margin-top: 2px;
    }
    .placeholder{
        // color: #ff0;
    }
    .up{
        margin-top: -2px;
    }
    .down-box{
        position: absolute;
        top: 50px;
        left: -1px;
        z-index: 2;
        width: calc(100% + 2px);
        background-color: inherit;
        font-size: 12px;
        border-radius: 2px;
        background-color: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,.15);
        border-radius: 4px;
        p{
            margin: 0;
            text-align: left;
            cursor: pointer;
            font-size: 14px;
            color: rgba(0,0,0,.65);
            text-indent: 10px;
            font-weight: 400;
        }
        p:hover{
            // background: #d3f2fd;
            background: rgba(18,25,50,0.04) ;
        }
    }
}
  .down {
    // transform-origin: center center;
    animation: Down 0ms linear;
  }
  
  .up {
    // transform-origin: center center;
    animation: Up 0ms linear;
  }
  
  @keyframes Down {
    from {
        transform: rotate(180deg);
    }
    to {
        transform: rotate(0deg);
    }
  }
  
  @keyframes Up {
    from {
        -webkit-transform: rotate(180deg);
    }
    to {
        -webkit-transform: rotate(360deg);
    }
  }


</style>
