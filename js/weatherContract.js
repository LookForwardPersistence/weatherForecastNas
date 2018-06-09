"use strict";

//定义保持对象
var WeatherItem =  function (item) {
    if(item){
        var item = JSON.parse(item);
        this.id = item.id;
        this.author = item.author;
        this.cityName = item.cityName;
        this.day = item.day;
    }else {
        this.id = "";
        this.author = "";
        this.cityName = "";
        this.day = "";
    }
}

WeatherItem.prototype ={
    toString:function () {
        return JSON.stringify(this)
    }
}

var Weathers = function () {
    LocalContractStorage.defineProperty(this,"index");
    LocalContractStorage.defineMapProperty(this,"weatherData",{
          parse:function (item) {
              return JSON.stringify(item);
          },
          stringify: function (val) {
              return val.toString();
          }
    });
    LocalContractStorage.defineMapProperty(this,"records");
}

Weathers.prototype = {
    init:function () {
        this.index = 0;
    },
    saveWeather:function (cityName,day) {
        if(!cityName || !day){
            return new Error("empty cityName or day");
        }
        var fromAuthor = Blockchain.transaction.from;
        var id = this.index;
        var weatherItem = new WeatherItem();
        weatherItem.id = id;
        weatherItem.author = fromAuthor;
        weatherItem.cityName = cityName;
        weatherItem.day = day;

        this.weatherData.put(id,weatherItem);

        var recordIds = this.records.get(fromAuthor) || [];
        recordIds[recordIds.length] = id;
        this.records.set(fromAuthor,recordIds);
        this.index++;
    },
    getList: function (author) {
        author = author.trim();
        if(!author){
            return new Error("empty author")
        }
        var ids = this.records.get(author) || [];
        var result =[];
        for(var i=0;i<ids.length;i++){
            var id = ids[i];
            result.push(this.weatherData.get(id))
        }
        return result;
    }
}

module.exports = Weathers;