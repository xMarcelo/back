var mysql = require('mysql');
const OPCIONES_CNX = {
    host: 'localhost',
    user: 'adm_frases',
    password: '123456',
    database: 'frases'
};

var conexion = mysql.createConnection(OPCIONES_CNX);
conexion.connect((err, res) => {
    if (err) throw err;

    console.log('Base de datos mysql, online');
});

module.exports = conexion;