
//  {
//     "place_id": 84685491,
//     "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
//     "osm_type": "way",
//     "osm_id": 35786246,
//     "lat": "50.5124269116883",
//     "lon": "30.804051040297",
//     "display_name": "Глинки вулиця, Масив, Бровари, Київська область, 07400, Україна",
//     "address": {
//         "road": "Глинки вулиця",
//         "neighbourhood": "Масив",
//         "city": "Бровари",
//         "state": "Київська область",
//         "postcode": "07400",
//         "country": "Україна",
//         "country_code": "ua"
//     },
//     "boundingbox": ["50.5082486", "50.5133088", "30.7976811", "30.8053816"]
// }

var renderCityByCoords = function(lat,long){
    $.post('./api/getCityByCoords',{lat:lat,long:long},function(resp){
        console.log(resp);
        var city = resp.address.city;
        $('#geoCity').html(city);
    })
};

// {
//     "daylight": "N",
//     "description": "Passing clouds. Cool.",
//     "skyInfo": "7",
//     "skyDescription": "Passing clouds",
//     "temperature": "13.00",
//     "temperatureDesc": "Cool",
//     "comfort": "13.00",
//     "highTemperature": "17.78",
//     "lowTemperature": "7.80",
//     "humidity": "78",
//     "dewPoint": "9.28",
//     "precipitation1H": "*",
//     "precipitation3H": "*",
//     "precipitation6H": "*",
//     "precipitation12H": "*",
//     "precipitation24H": "*",
//     "precipitationDesc": "",
//     "airInfo": "*",
//     "airDescription": "",
//     "windSpeed": "1.85",
//     "windDirection": "220",
//     "windDesc": "Southwest",
//     "windDescShort": "SW",
//     "barometerPressure": "1009.60",
//     "barometerTrend": "Rising",
//     "visibility": "20.12",
//     "snowCover": "*",
//     "icon": "14",
//     "iconName": "night_mostly_clear",
//     "iconLink": "https://weather.cit.api.here.com/static/weather/icon/23.png",
//     "ageMinutes": "118",
//     "activeAlerts": "0",
//     "country": "Ukraine",
//     "state": "Kiev",
//     "city": "Brovars’ka Mis’krada",
//     "latitude": 50.5078,
//     "longitude": 30.8012,
//     "distance": 20.96,
//     "elevation": 0,
//     "utcTime": "2019-05-04T21:00:00.000+03:00"
// };

var renderWeatherByCoords = function(lat,long){
    $.post('./api/getWeatherByCoords',{lat:lat,long:long,fake:true},function(resp){
        var weather = resp;
        console.log(resp);
        var arr = [];
        arr.push(`Діапазон температур ${weather.lowTemperature} - ${weather.highTemperature} ℃`);
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

    var leadZero = function(val){
        val = val+'';
        if (val.length==1) return '0'+val;
        return val;
    };

    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    var str = leadZero(day)+'-'+leadZero(month)+'-'+leadZero(year);
    $('#nowDate').html(str);
};

navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    renderCityByCoords(lat,long);
    renderWeatherByCoords(lat,long);
    renderNowDate();
});