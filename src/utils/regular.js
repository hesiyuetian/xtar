import BigNumber from "bignumber.js";
import load from './loading'
load.reset();

function regular() {
    this.sensitiveCheck = str => {
        if(!str) return ''
        
        let sensitiveReg = /^(\w{4})(\w*)(\w{4})$/;
        return (str.toString()).replace(sensitiveReg, function(a, b, c, d) {
            return b + (c.replace(/\w/g, ".")).substring(0, 5) + d;
        });
    }
    // 千分位分割
    this.numFormat = val => {
        var v, j, sj, rv = "";
        v = val.toString().replace(/,/g, "").split(".");
        j = v[0].length % 3;
        sj = v[0].substr(j).toString();
        for (var i = 0; i < sj.length; i++) {
        rv = (i % 3 == 0) ? rv + "," + sj.substr(i, 1) : rv + sj.substr(i, 1);
        }
        var rvalue = (v[1] == undefined) ? v[0].substr(0, j) + rv : v[0].substr(0, j) + rv + "." + v[1];
        if (rvalue.charCodeAt(0) == 44) {
        rvalue = rvalue.substr(1);
        }
        return rvalue
    }

    this.UTCtime = () => {
        return (new Date(new Date().toUTCString())).getTime();
    }
    
    // 数字的相乘   fiexd ===> 小数位     numberAry: Array<any> = [] , fixed: number = 1
    this.toBigsells = (numberAry , fixed) => {
        if(!!!fixed) fixed = 1;
        let num = new BigNumber(1);
        for(let i in numberAry){
          num = num.multipliedBy(numberAry[i]);
        }
        return num.toFixed(fixed,1) // 2：向上取整   1： 向下取整
    }

    // numberAry: Array<any> = []
    this.toBigsell = (numberAry) => {
        let num = new BigNumber(1);
        for(let i in numberAry){
          num = num.multipliedBy(numberAry[i]);
        }
        return num
    }

    this.toNumber = data => {
		return Number(data || 0)
    }

    // 比较大小   1:  x>y;    -1:	x<y;        0: x==y
    this.comparedTo = (x,y) => {
        x = new BigNumber(x);
        y = new BigNumber(y);
        return x.comparedTo(y);
    }

    // 数字的除   fiexd ===> 小数位     price: number, rale: number, fixed: number = 1
    this.toDividedBy = (price, rale, fixed) => {
        if(!!!fixed) fixed = 1
        let num = new BigNumber(price).dividedBy(rale);
        return num.toFixed(fixed,1) // 2：向上取整   1： 向下取整
    }

    // 数字的除   fiexd ===> 小数位     ary: Array<any>, fixed: number = 1
    this.toDividedByAry = (ary, fixed) => {
        if(!!!fixed) fixed = 1
        let num = new BigNumber(ary[0]);
        for(let i = 1; i < ary.length; i++){
            num = num.dividedBy(ary[i]);
        }
        return num.toFixed(fixed,1) // 2：向上取整   1： 向下取整
    }

    // 两数相加
    this.toPlus = (pre,ads) => {
        let _C = new BigNumber(pre);
        return _C.plus(ads).toString();
    }

    // 两数相减
    this.toModulo = (pre,next,fixed) => {
        if(!!!fixed) fixed = 8
        let _C = new BigNumber(pre);
        return _C.minus(next).toFixed(fixed,1);
    }

    // 保留小数位
    this.toFixed = (number,fixed) => {
        number = this.fanToNum(number);
        return new BigNumber(number).toFixed(fixed,1)
    }

    // 幂运算
    this.exponentiatedBy = (num,pow) => {
        return this.fanToNum(new BigNumber(num).exponentiatedBy(pow).toString())
    }

    // 处理科学计数法
    this.fanToNum = num => {
        if (!num) return num
        num = num.toString()
        if (num.indexOf('e') === -1) { return num }
        let reg = /(?:(\d)+(?:.(\d+))?)[e]{1}-(\d)/.exec(num)
        if (!reg) {
            return num
        }
        let v = num
        if (reg[3] === '7') {
            v = '0.000000' + (reg[2] ? reg[1] + reg[2] : reg[1])
        } else {
            v = '0.0000000' + reg[1]
        }
        return v
    }

    //utc时间转化为本地时间
    this.utctimeToLocaltime = time => {
        //转化为utc时间格式
        let utcTime = time.replace(' ', 'T')+'Z';
        let newDate = new Date(utcTime);

        let YY = newDate.getFullYear() + '-';
        let MM = (newDate.getMonth() + 1 < 10 ? '0' + (newDate.getMonth() + 1) : newDate.getMonth() + 1) + '-';
        let DD = (newDate.getDate() < 10 ? '0' + (newDate.getDate()) : newDate.getDate());
        let hh = (newDate.getHours() < 10 ? '0' + newDate.getHours() : newDate.getHours()) + ':';
        let mm = (newDate.getMinutes() < 10 ? '0' + newDate.getMinutes() : newDate.getMinutes()) + ':';
        let ss = (newDate.getSeconds() < 10 ? '0' + newDate.getSeconds() : newDate.getSeconds());

        return YY + MM + DD +" "+hh + mm + ss
    }

    //复制
    this.copyTextToClipboard = text => {
        var textArea = document.createElement('textarea')
        textArea.style.position = 'fixed'
        textArea.style.top = 0
        textArea.style.left = 0
        textArea.style.width = '2em'
        textArea.style.height = '2em'
        textArea.style.padding = 0
        textArea.style.border = 'none'
        textArea.style.outline = 'none'
        textArea.style.boxShadow = 'none'
        textArea.style.background = 'transparent'
        textArea.value = text
        document.body.appendChild(textArea)
        textArea.select()
        try {
          var successful = document.execCommand('copy')
          var msg = successful ? 'successful' : 'unsuccessful'
        } catch (err) {
          console.log('Oops, unable to copy')
        }
        document.body.removeChild(textArea);
        load.tipSuccessShow('复制成功');
    }

    // 获取当前时区
    this.getTimeZone = () => {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    this.setTitle = title => {
        document.title = title
    }
    
    //验证密码强度
    this.verificationPassword = txt => {
        var lvl = 0;

        /[0-9]/.test(txt) && lvl++;
        /[a-z]/.test(txt) && lvl++;
        /[A-Z]/.test(txt) && lvl++;
        /\W/.test(txt) && lvl++;
        (!!!txt || txt.length < 8) && (lvl = 0);

        return lvl;

        // return zxcvbn(txt).score;
    }

    // 组装深度数据 [price,amount,v] ==> {price:'',amount:'',v:''}
    this.makeDepth = data => {
        if(data.length < 1) return [];
        let _copy= [];
        data.map(item=>{
            let obj = {price:'',amount:'',v:''};
            [obj.price,obj.amount,obj.v] = [item[0],item[1],item[2]];
            _copy.push(obj)
        })
        return _copy;
    }

    // 获取n天的时间 yyyy-mm-dd 
    this.fun_date = n => {
        var date1 = new Date();
        var date2 = new Date(date1);
        date2.setDate(date1.getDate()+n);
		var time2 = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
		return time2
    }
    
    // 获取n月的时间 yyyy-mm-dd 
    this.fun_month = n => {
        var nowdate = new Date();
		nowdate.setMonth(nowdate.getMonth()+n);
        return `${nowdate.getFullYear()}-${nowdate.getMonth()+1}-${nowdate.getDate()}`
    }
    
    // 字节数值转换
    this.bitChange = val => {
        if(!!!val) return '0 bit'
        else if(val < 1024) return `${val} bit`
        else if((val / 1024) < 1024) return `${this.toDividedBy(val, 1024, 3)} KB`
        else if((val / 1024**2) < 1024) return `${this.toDividedBy(val, 1024**2, 3)} MB`
        else if((val / 1024**3) < 1024) return `${this.toDividedBy(val, 1024**3, 3)} GB`
        else if((val / 1024**4) < 1024) return `${this.toDividedBy(val, 1024**4, 3)} TB`
    }

    // ms数值转换
    this.msChange = val => {
        if(!!!val) return '0 μs'
        else if(val < 10**3 ) return `${val} μs`
        else if(val / 10**3 < 10**3 ) return `${this.toDividedByAry([val, 10**3], 3)} ms`
        else if(val / 10**6 < 60) return `${this.toDividedByAry([val, 10**6], 2)} m`
        else if(val / 10**6 / 60 < 60) return `${this.toDividedByAry([val, 10**6, 60], 2)} min`
        else if(val / 10**6 / 60**2 < 24) return `${this.toDividedByAry([val, 10**6, 60**2], 2)} h`
    }

    // 抵押Xtar换算
    this.xtarChange = val => {
        if(!!!val) return 0
        else return this.toDividedBy(val, 10**8, 4)
    }

    this.isCssSuper = () => {
		if(CSS.supports("(-webkit-text-security: disc)")) return true
		else return false
	}

}

const regularUtil = new regular()
export default regularUtil