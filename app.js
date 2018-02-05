// requeres
var express = require('express');
var mysql = require('mysql');



// inicializar variables
var app = express();



// conexion a bd
const OPCIONES_CNX = {
    host: 'localhost',
    user: 'adm_frases',
    password: '123456',
    database: 'frases'
};

let conexion = mysql.createConnection(OPCIONES_CNX);
conexion.connect((err, res) => {
    if (err) throw err;

    console.log('Base de datos mysql, online');
});


// rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});



// escuchar peticiones
app.listen(3000, () => {
    console.log('express server corriendo en el puerto 3000, online');
});