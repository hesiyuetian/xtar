function Loadings(){
    this.body = "" ;
    this.setTimeout1 = '';
    this.setTimeout2 = '';
    this.setTimeout3 = 'any';
    this.setTimeout4 = '';
    this.setInterval1 = '';

    this.reset = () => {
        this.initBody();
        this.clearTimeout();
    }
    this.initBody = () => {
        this.body = document.getElementsByTagName('body')[0];
    }

    //loading框
    this.loadingShow = () => {
        this.hide();
        if(!this.body){ this.initBody() }


        // let DOM = `<div class="loadings">
        //             <div class="loading-main1"> 
        //                 <i class="fa fa-spin fa-spinner"></i>  
        //             </div>
        //            </div>`;
        let DOM = `<div class="loadings">
                        <img class='loadings-loading f-center' src="https://beta.lyra.site/assets/images/loading_apng.png" alt="">
                   </div>`;
        let popups = document.createElement('div');
        popups.className = 'popups';
        popups.innerHTML = DOM;
        this.body.appendChild(popups);
    }

    //loading框 - 3s自动消失
    this.loadingSetShow = () => {
        this.hide();
        if(!this.body){ this.initBody() }

        let DOM = `<div class="loadings">
                    <div class="loading-main1"> 
                        <i class="fa fa-spin fa-spinner"></i>  
                    </div>
                </div>`;
        let popups = document.createElement('div');
        popups.className = 'popups';
        popups.innerHTML = DOM;
        this.body.appendChild(popups);

        this.setTimeout1 = setTimeout(()=>{
            this.hide();
        },3000)
    }


    //tip 普通提示框
    this.tipShow = value => {
        this.hide();
        if(!this.body){ this.initBody() }

        let v = value || 'success';
        let DOM = `<div class="tip-alert" > 
                    <div class="tip-main tip-putong" >
                        ${v}
                        <span class="iconfont tip-close">&#xe608;</span>
                    </div>
                    
                   </div>`;
        let popups = document.createElement('div');
        popups.className = 'popups';
        popups.innerHTML = DOM;
        
        this.body.appendChild(popups);
        this.closeBtn();
        this.setTimeout2 = setTimeout(()=>{ this.hide() }, 3000)
    }
    //tip 成功框
    this.tipSuccessShow = value => {
        console.log(this.body,'this.body')
        this.hide();
        if(!this.body){ this.initBody() }

        let v = value || 'success';
        let DOM = `<div class="tip-alert" > 
                    <div class="tip-main tip-success" >
                        ${v}
                        <span class="iconfont tip-close">&#xe608;</span>
                    </div>
                    
                   </div>`;
        let popups = document.createElement('div');
        popups.className = 'popups';
        popups.innerHTML = DOM;

        this.body.appendChild(popups);
        this.closeBtn();
        this.setTimeout2 = setTimeout(()=>{ this.hide() }, 3000)
    }

    //tip 警告框
    this.tipWarningShow = value => {
        if(!this.body){ this.initBody() }

        let v = value || '网络异常，请稍后重试';
        let DOM = `<div class="tip-alert" > 
                    <div class="tip-main tip-warning" >
                        ${v}
                        <span class="iconfont tip-close" >&#xe608;</span>
                    </div>
                    
                   </div>`;
        let popups = document.createElement('div');
        popups.className = 'popups';
        popups.innerHTML = DOM;

        this.body.appendChild(popups);
        this.closeBtn();
        this.setTimeout2 = setTimeout(()=>{ this.hide() }, 3000)
    }

    //tip 失败框
    this.tipErrorShow = value => {
        this.hide();
        if(!this.body){ this.initBody() }

        let v = value || '网络异常，请稍后重试';
        let DOM = `<div class="tip-alert" > 
                    <div class="tip-main tip-error" >
                        ${v}
                        <span class="iconfont tip-close">&#xe608;</span>
                    </div>
                   </div>`;
        let popups = document.createElement('div');
        popups.className = 'popups';
        popups.innerHTML = DOM;

        this.body.appendChild(popups);
        this.closeBtn();
        this.setTimeout2 = setTimeout(()=>{ this.hide() }, 3000)
    }

    //成功提示框
    this.successFrame = (value, value2) => {
        if(!this.body){ this.initBody() }

        let v = value || '';
        let v2 = value2 || '';
        let DOM = `<div class="frame"> 
                    <div class="frame-main" >
                        <div class="tip-main" >
                            <span class="tip-icon tip-success">
                                <i class="fa fa-check"></i> 
                            </span>
                            ${v}
                            <p>${v2}</p>
                        </div>
                    </div>
                   </div>`;
        let popups = document.createElement('div');
        popups.className = 'popups';
        popups.innerHTML = DOM;
        this.body.appendChild(popups);

        this.setTimeout2 = setTimeout(()=>{
            this.hide();
        }, 2900)
    }


    //关闭按钮添加事件  
    this.closeBtn = () => {
        let close = document.getElementsByClassName('tip-close');
        for(let i=0; i<close.length; i++){
            close[i].onclick = ()=>{ this.hide() }
        }
    }
    this.hide = () => {
        if(!this.body){ this.initBody() }
        
        let popups = document.getElementsByClassName('popups');
        if(popups && popups.length > 0){
            for(let i=0; i<popups.length; i++){
                this.body.removeChild(popups[i]);
            }
        }
        this.clearTimeout();
        
    }

    //成功提示框
    this.txid = value => {
        if(!this.body){ this.initBody() }

        let v = value || '';
        let DOM = `<div class="frame"> 
                    <div class="frame-main" >
                        <div class='alerted'>
                            ${value}
                            <div style='text-align: center;margin-top:20px;'><span class="iconfont tip-close f-cursor">&#xe608;</span></div>
                        </div>
                        
                    </div>
                   </div>`;
        let popups = document.createElement('div');
        popups.className = 'popups';
        popups.innerHTML = DOM;
        this.body.appendChild(popups);
        this.closeBtn();
    }
    
    this.clearTimeout = () => {
        clearTimeout(this.setTimeout1);
        clearTimeout(this.setTimeout2);
        clearTimeout(this.setTimeout3);
        clearTimeout(this.setTimeout4);

        clearTimeout(this.setInterval1);
    }
}

const load = new Loadings()
export default load