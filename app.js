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
var appUsuario = require('./rutas/usuario');
var appLogin = require('./rutas/login');
var appApiGen = require('./rutas/apigen');
var appUpload = require('./rutas/upload');

// rutas
app.use('/frase', appFrase);
app.use('/usuario', appUsuario);
app.use('/login', appLogin);
app.use('/apigen', appApiGen);
app.use('/upload', appUpload);
app.use('/', appRoutes);


// escuchar peticiones
app.listen(3000, () => {
    console.log('express server corriendo en el puerto 3000, online');
});