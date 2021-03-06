var express = require('express');
var bcrypt = require('bcryptjs'); //passoword
// var jwt = require('jsonwebtoken');
// var SEED = require('../config/config').SEED;
var mdVerificarToken = require('../middleware/autentificacion');

var app = express();
var apiLogistica = require('../models/logistica');

var datos_api_model = {};


// mdVerificarToken.verificarToken
app.get('/distribuicion/:opcion', mdVerificarToken.verificarToken, (req, res) => {
    var otrosDatosRecibidos = '';
    try {
        otrosDatosRecibidos = JSON.parse(req.headers['otrosdatos']);
    } catch (err) {
        return res.status(200).json({
            ok: false,
            mensaje: 'LA PETICION DEBE TENER UN HEADER: [otrosdatos]',
            error: err
        });
    }

    // POST console.log(req.body);     
    datos_api_model = {
        usuario: req.usuariotoken,
        opcion: req.params.opcion,
        otrosDatos: otrosDatosRecibidos
    }

    apiLogistica.distribuicion(datos_api_model, (err, data) => {
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

// mdVerificarToken.verificarToken
app.post('/distribuicion/:opcion', mdVerificarToken.verificarToken, (req, res) => {
    var otrosDatosRecibidos = null;
    try {
        otrosDatosRecibidos = req.body;
    } catch (err) {
        return res.status(200).json({
            ok: false,
            mensaje: 'LA PETICION DEBE TENER UN ARRAY BODY con parametros para procesar',
            error: err
        });
    }

    // console.log(req.body);
    datos_api_model = {
        usuario: req.usuariotoken,
        opcion: req.params.opcion,
        otrosDatos: otrosDatosRecibidos
    }

    apiLogistica.distribuicion(datos_api_model, (err, data) => {
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