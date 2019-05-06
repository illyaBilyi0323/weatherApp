var renderCityByCoords = function(lat,long){
    $.post('./api/getCityByCoords',{lat:lat,long:long},function(resp){
        console.log(resp);
        var city = resp.address.city;
        $('#geoCity').html(city);
    })
};

var renderWeatherByCoords = function(lat,long){
    $.post('./api/getWeatherByCoords',{lat:lat,long:long,fake:0},function(resp){
        var weather = resp;
        console.log(resp);
        var arr = [];
        arr.push(`Діапазон температур ${parseInt(weather.lowTemperature)} - ${parseInt(weather.highTemperature)} ℃`);
        arr.push(`Вологість ${weather.humidity} %`);
        arr.push(`Опис температури ${weather.temperatureDesc}`);
        arr.push(`Швидкість вітру ${weather.windSpeed} м/c`);
        var str = arr.join('<br>');
        $('#weatherDetail').html(str);
        $('#weatherIcon').attr('src',weather.iconLink);
        $('#temp').html(parseFloat(weather.temperature));

        renderWeatherCategory(weather.skyInfo,weather.precipitationDesc,weather.temperature);

    })
};

var renderWeatherCategory = function(skyInfo,precipitationDesc,temperature){
    $.post('./api/getWeatherCategory',
        {skyInfo:skyInfo,precipitationDesc:precipitationDesc,temperature:temperature},
        function(resp){
        var images = resp.images;
        $('#cloth1').attr('src','./clothes/'+images[0]+'.jpg');
        $('#cloth2').attr('src','./clothes/'+images[1]+'.jpg');
    });
};

var renderNowDate = function(){
    $('#nowDate').html((new Date()).toLocaleDateString("en-US", {day: "2-digit", month: "2-digit", year: "numeric"}));
};

navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    renderCityByCoords(lat,long);
    renderWeatherByCoords(lat,long);
    renderNowDate();
});