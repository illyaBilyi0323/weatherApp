const renderCityByCoords = function (lat, long) {
    $.get('./api/getCityByCoords', {lat: lat, long: long}, function (resp) {
        const $geoCity = $('#geoCity');
        if (resp.error) {
            $geoCity.text("Неможливо визначити");
            return;
        }
        const city = resp.address.city;
        $geoCity.html(city);
    })
};

const renderWeatherByCoords = function (lat, long) {
    $.get('./api/getWeatherByCoords', {lat: lat, long: long, fake: 0}, function (resp) {
        const weather = resp;
        const arr = [];
        arr.push(`Діапазон температур ${parseInt(weather.lowTemperature)} - ${parseInt(weather.highTemperature)} &deg;C`);
        arr.push(`Вологість ${weather.humidity} %`);
        arr.push(`Опис температури ${weather.temperatureDesc}`);
        arr.push(`Швидкість вітру ${weather.windSpeed} м/c`);
        const str = arr.join('<br>');
        $('#weatherDetail').html(str);
        $('#weatherIcon').attr('src', weather.iconLink);
        $('#temp').html(Math.round(parseFloat(weather.temperature)));

        renderWeatherCategory(weather.skyInfo, weather.precipitationDesc, weather.temperature);

    })
};

const renderWeatherCategory = function (skyInfo, precipitationDesc, temperature) {
    $.get('./api/getWeatherCategory',
        {skyInfo: skyInfo, precipitationDesc: precipitationDesc, temperature: temperature},
        function (resp) {
            const images = resp.images;
            $('#cloth1').attr('src', './clothes/' + images[0] + '.jpg');
            $('#cloth2').attr('src', './clothes/' + images[1] + '.jpg');
        });
};

const renderNowDate = function () {
    $('#nowDate').html((new Date()).toLocaleDateString("en-US", {day: "2-digit", month: "2-digit", year: "numeric"}));
};

const choosePlace = function (span) {
  console.log($(span).text());
};

navigator.geolocation.getCurrentPosition(function (position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    renderCityByCoords(lat, long);
    renderWeatherByCoords(lat, long);
    renderNowDate();
});