import xtar from './xtar'
function xtarServe(){
    this.load = () => {
        console.log(xtar.Wallet.Create('password', '37f58cb690f46ce5f58b29a86846195e7feddf7ef90aedf49731501f8e67d2fc'),"!232")
    }
}

export default new xtarServe();