
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

function configureEndpoints(app) {
    var pages = require('./pages');
    var api = require('./api');


    app.post('/api/getCityByCoords/', api.getCityByCoords);
    app.post('/api/getWeatherByCoords/', api.getWeatherByCoords);
    app.post('/api/getWeatherCategory/', api.getWeatherCategory);

    app.get('/', pages.mainPage);


    //Якщо не підійшов жоден urll
    app.use(express.static(path.join(__dirname, '../client')));
}

function startServer(port) {
    //Створюється застосунок
    var app = express();

    //Налаштування директорії з шаблонами
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    //Розбір POST запитів
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    //Налаштовуємо сторінки
    configureEndpoints(app);

    //Запуск додатка за вказаним портом
    app.listen(port, function () {
        console.log('My Application Running on http://localhost:'+port+'/');
    });
}

startServer(8080);