var request = require("request");
var fs = require("fs");

const USER_AGENT =  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36 OPR/58.0.3135.132";

exports.getCityByCoords = function(req, response) {

    var options = {
        url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${req.body.lat}&lon=${req.body.long}&zoom=18&addressdetails=1`,
        headers: {
            'User-Agent': USER_AGENT
        }
    };

    request(options, (err, res, body) => {
        if (err) { return console.log(err); }
        response.send(JSON.parse(body));
    });

};

// https://developer.here.com/documentation/weather/topics/resource-type-weather-items.html
exports.getWeatherByCoords = function(req, response) {

    if (req.body.fake == 1) {
        console.log('faked weather');
        var body =  fs.readFileSync('./server/fake.json') ;
        response.send(JSON.parse(body));
        return;
    }

    var options = {
        url: `https://weather.cit.api.here.com/weather/1.0/report.json?product=observation&latitude=${req.body.lat}&longitude=${req.body.long}&oneobservation=true&app_id=DemoAppId01082013GAL&app_code=AJKnXv84fjrb0KIHawS0Tg`,
        headers: {
            'User-Agent': USER_AGENT
        }
    };

    request(options, (err, res, body) => {
        if (err) { return console.log(err); }
        body = JSON.parse(body);
        var weather = body.observations.location[0].observation[0];
        response.send(weather);
    });

};

const sunny = [
    1,
    2,
    3,
    4,
    5,
    6,
    8,
    9,
    10,
    14,
    15,
    28,
    29,
    30,
    34
];

// categories
// rain -3
// sun 1
// nosun 2
exports.getWeatherCategory = function(req, response) {
    var body = req.body;

    var skyInfo = parseInt(body.skyInfo);
    var temperature = parseInt(body.temperature);
    var cat;
    var precipitationDesc = body.precipitationDesc;
    if (precipitationDesc!==undefined && precipitationDesc.length>0) {
        cat = 3;
    } else {
        if (sunny.includes(skyInfo))  cat = 1;
        cat = 2;
    }

    var responseArr;
    if (cat==1) {
        if (temperature>18) responseArr = ['b','f'];
        else responseArr = ['d','f'];
    } else if (cat==2) {
        if (temperature>18) responseArr = ['g','h'];
        else responseArr = ['b','a'];
    } else {
        if (temperature>18) responseArr = ['e','c'];
        else responseArr = ['b','c'];
    }
    response.send({images:responseArr});

};


