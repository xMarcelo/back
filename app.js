// requires
var express = require('express');
var bodyParser = require('body-parser');
var db = require('./conexionbd');

//var mysql = require('mysql');


// inicializar variables
var app = express();

// body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// importar rutas
var appRoutes = require('./rutas/app');
var appFrase = require('./rutas/frase');

// rutas
app.use('/frase', appFrase);
app.use('/', appRoutes);


// escuchar peticiones
app.listen(3000, () => {
    console.log('express server corriendo en el puerto 3000, online');
});