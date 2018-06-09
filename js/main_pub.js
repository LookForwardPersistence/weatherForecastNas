"user strict"

 var  contractAddress = "n1g8S8DRc9Jzw9exLu36MWTaEwq33iZHzit";//测试智能合约地址

//var  contractAddress ="n1qqiYw1pse9gVWT1dPsjSwXYcyNNatVMqK";//正式合约地址
var nebulas = require('nebulas'),
    account = nebulas.Account,
    neb = new nebulas.Neb();

 neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));//测网
//neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));// 主网

function isArray(obj) {
    return (typeof obj =='object')&&obj.constructor == Array;
}

//获取url参数

function  getQueryString() {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i"); // 匹配目标参数
    var result = window.location.search.substr(1).match(reg); // 对querystring匹配目标参数
    if(result!=null){
        return decodeURIComponent(result[2]);
    }else {
        return null;
    }
}