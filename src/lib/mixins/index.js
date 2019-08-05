import { pubSub, watchPubSub} from '../../watch/index'
const getPrecision = {
    data(){
        return {
            precision = {
                amountPrecision: 4,
                basePrecision: 4,
                pricePrecision: 4,
                minSize: 1
            }
        }
    },
    created() {
        this.init();
    },
    mounted() {
        watchPubSub.resetData(data =>{this.watchReset(data) })
    },
    methods: {
        init(){
            let pair = window.location.hash.replace('#','')
            console.log(pair,'pair')
        },
        watchReset(data){
            console.log()
        },

    },
}