var express = require('express');
var bcrypt = require('bcryptjs'); //passoword
var mdVerificarToken = require('../middleware/autentificacion');

var app = express();
var apiMaestros = require('../models/maestros');

var datos_api_model = {};

// listar tablas maestros


// mdVerificarToken.verificarToken
app.get('/:opcion', mdVerificarToken.verificarToken, (req, res, next) => {
    var desde = req.query.desde || 0;
    var filas = req.query.filas || 0;
    var tabla = req.query.tabla || ''; // para opcion 0 y 2 generales org o generales libres ej: tipopagos, tipocomprobante etc
    datos_api_model = {
        usuario: req.usuariotoken,
        opcion: req.params.opcion,
        paginacion_desde: desde,
        paginacion_filas: filas,
        tabla: tabla
    }

    apiMaestros.listas(datos_api_model, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR EN BASE DE DATOS',
                error: err
            });
        }


        return res.status(200).json({
            ok: true,
            data: data,
            rows: data.length
        });
    });
});


module.exports = app;