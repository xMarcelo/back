var mysql = require('mysql');
var OPCIONES_CNX = {
    host: 'localhost',
    user: 'adminpime',
    password: 'AdminMipe123',
    database: 'webmipe'
};

var conexion = mysql.createConnection(OPCIONES_CNX);
conexion.connect((err, res) => {
    if (err) throw err;

    console.log('Base de datos mysql, online');
});

module.exports = conexion;