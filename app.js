// requires
var express = require('express');
var bodyParser = require('body-parser');
var db = require('./conexionbd');

//var mysql = require('mysql');


// inicializar variables
var app = express();

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, *");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// importar rutas
var appRoutes = require('./rutas/app');
var appFrase = require('./rutas/frase');
var appUsuario = require('./rutas/usuario');
var appLogin = require('./rutas/login');
var appApiGen = require('./rutas/apigen');
var appUpload = require('./rutas/upload');
var appImagenes = require('./rutas/imagenes');

var appLogistica = require('./rutas/logistica');
var appVentas = require('./rutas/ventas');
var appMaestros = require('./rutas/maestros');

// rutas
app.use('/frase', appFrase);
app.use('/usuario', appUsuario);
app.use('/login', appLogin);
app.use('/apigen', appApiGen);
app.use('/upload', appUpload);
app.use('/img', appImagenes);

app.use('/logistica', appLogistica);
app.use('/ventas', appVentas);
app.use('/maestros', appMaestros);
app.use('/', appRoutes);


// escuchar peticiones
app.listen(3000, () => {
    console.log('express server corriendo en el puerto 3000, online');
});