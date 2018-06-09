
//动态创建script
function jsonp(url) {
    var sp = document.createElement('script');
    sp.src = url;
    document.body.append(sp);
    document.body.removeChild(sp);
}

//获取当前城市
var currentCity = new BMap.LocalCity();
var cityName;
currentCity.get(getCityFun);
function getCityFun(res) {
    cityName =res.name.replace("市","");
    document.getElementById("cityNameId").value = cityName;
}

//加载当前城市天气
setTimeout(function () {
    var api =  'https://sapi.k780.com/?app=weather.future&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json&jsoncallback=getWeatherData&weaid=' + encodeURI(cityName);
    jsonp(api);
},1000)

//获取天气预报数据
function getWeatherData(res) {
    var data = res.result;
    var curDate = getCurDate();

    //一周天气
    var htmlWeek="";

    //仪表盘
    var xData = [];
    var dayData = [];
    var nightData = [];
    for(var i=0;i<data.length;i++){
        var em = data[i];
        htmlWeek = htmlWeek + '  <div class="date-box">' +
            '            <img src="images/b/'+em.weather_iconid+'.png" class="date-icon" />' +
            '            <ul class="air-info-date">' +
            '                <li>'+em.weather+'</li>' +
            '                <li>'+em.winp+'</li>' +
            '                <li>'+em.temperature+'</li>' +
            '                <li>'+em.days+'</li>' +
            '                <li>'+em.week+'</li>' +
            '            </ul>' +
            '        </div>';

        xData.push(data[i].days);
        dayData.push(data[i].temp_high);
        nightData.push(data[i].temp_low);
    }

    //七天昼夜气温趋势
    draw('gotobedbar', xData,dayData,nightData);
    document.getElementById("weekWeatherId").innerHTML = htmlWeek;
    console.log(data)


    //当天天气
    var curWeather=[];
    for(var i=0;i<data.length;i++){
        if(curDate === data[i].days){
            curWeather=data[i];
            break;
        }
    }
    var htmlCurWeather = '<img class="icon-air" src="images/b/'+curWeather.weather_iconid+'.png" />' +
        // '<img class="icon-air1" src="images/b/'+curWeather.weather_iconid1+'.png" />' +
        '<p class="air-time"><span>'+curWeather.days+'</span><span>'+curWeather.week+'</span></p>' +
        '<p class="air-num">'+curWeather.temp_high+'<i>℃</i></p>' +
        '<P class="air-weather">'+curWeather.weather+'</P>' +
        '<b class="air-city">'+curWeather.citynm+'</b>' +
        '<ul class="air-info">' +
        '<li>'+curWeather.winp+'</li>' +
        '<li>'+curWeather.temperature+'</li>' +
        '</ul>';

    document.getElementById("curWeatherId").innerHTML=htmlCurWeather;


}

function actionSearch() {
    var name = document.getElementById('cityNameId').value;
    if(!name){
        alert("请输入城市名称");
        return;
    }
    var api =  'https://sapi.k780.com/?app=weather.future&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json&jsoncallback=getWeatherData&weaid=' + encodeURI(name);
    jsonp(api);
}

var NebPay = require("nebpay")
var nebPay = new  NebPay();
var serialNumber;
var intervalCount=0;
//查询
document.getElementById("searchId").addEventListener("click",function () {
  var name = document.getElementById("cityNameId").value;
  if(!name){
      alert("请输入城市");
      return;
  }
  var to = contractAddress;
  var value = 0;
  var curDate = getCurDate();
  var callFun = "saveWeather";
  var callArgs = "[\""+name+"\",\""+curDate+"\"]";
  serialNumber = nebPay.call(to,value,callFun,callArgs,{
      listener: callBackFun
  });
    // getResult();
 setInterval(function () { //心跳 5s查询是否成功
     getResult();
     intervalCount++
 }, 5000)
})
//交易处理返回信息
function callBackFun(res) {
    console.log("response :" + JSON.stringify(res));
}

//检查返回状态
function getResult() {
        nebPay.queryPayInfo(serialNumber).then(
            function (res) {
                console.log("支付结果");
                console.log(res);
                var result = JSON.parse(res);
                if(result.data.status === 1){
                        actionSearch();
                }else {
                    alert("支付失败")
                }
            }
        )
}
//响应输入法的“搜索” 查询
document.getElementById("cityNameId").addEventListener("keypress", function(e) {
    //
    var keyCode = 0;
    if(!e) e = event;
    keyCode = e.keyCode || e.which || e.charCode;
    if(keyCode == 13) {
     actionSearch();
    }
});
//获取当前日期
function getCurDate() {
    var date = new Date();
    var seperator = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var formatdate = date.getFullYear() + seperator + month + seperator + strDate;
    return formatdate;
}


function draw(id,xData,dayData,nightData) {
    var o = document.getElementById(id);
    var height = document.documentElement.clientHeight;
    height -= 330;
    o.style.height= height+"px";

    this.chart = echarts.init(o,'macarons');
    const option = this.getOption(xData,dayData,nightData)
    this.chart.setOption(option);
}
function getOption(xData,dayData,nightData){
    var option = {
        title: {
            text: '七天昼夜气温趋势',
            subtext: '气温（℃）',
            left:'center',
            textStyle:{
                color: '#fff'
            },
            subtextStyle: {
                color: '#fff'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'

            }
        },
        legend: {
            data: ['白天', '晚上'],
            orient:'vertical',
            left:'right',
            top:'middle',//如果 top 的值为'top', 'middle', 'bottom'，组件会根据相应的位置自动对齐。
            itemGap:20,
            textStyle:{
                color: '#fff'
            }
        },
        toolbox: {
            show: true,
            orient: 'horizontal',      // 布局方式，默认为水平布局，可选为：
            // 'horizontal' ¦ 'vertical'
            x: 'right',                // 水平安放位置，默认为全图右对齐，可选为：
                                       // 'center' ¦ 'left' ¦ 'right'
                                       // ¦ {number}（x坐标，单位px）
            y: 'top',                  // 垂直安放位置，默认为全图顶端，可选为：
                                       // 'top' ¦ 'bottom' ¦ 'center'
                                       // ¦ {number}（y坐标，单位px）
            color: ['#d2691e', '#22bb22', '#4b0082', '#1e90ff'],
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        dataZoom: {
            show: true,
            realtime: true,
            start: 0,
            end: 100
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: xData,
                axisLine:{
                    lineStyle:{
                        color: '#fff'
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLine:{
                    lineStyle: {
                        color: '#fff'
                    }
                }
            }
        ],
        series: [
            {
                name: '白天',
                type: 'line',
                tiled : '气温',
                areaStyle: {normal: {}},
                data: dayData
            },
            {
                name: '晚上',
                type: 'line',
                tiled : '气温',
                areaStyle: {normal: {}},
                data: nightData
            }
        ]
    };

    return option;
}
