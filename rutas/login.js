var express = require('express');
var bcrypt = require('bcryptjs'); //passoword
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();
var apiGEN = require('../models/apigen');

var datos_api_model = {};

app.post('/:tabla', (req, res) => {
    var body = req.body;
    var parametro = body.email ? "where email='" + body.email + "' and estado=0" : "where usuario='" + body.usuario + "' and estado=0";
    // valida por correo o usuario        
    //var parametro = "where email='" + body.email + "' and estado=0";

    datos_api_model = {
        tabla: req.params.tabla,
        condiciones_de_busqueda: parametro
    };

    apiGEN.findBy(datos_api_model, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR AL LOGUEAR',
                error: err
            });
        }
        if (data.length === 0) {
            return res.status(400).json({
                ok: false,
                mensaje: 'CREDENCIALES INCORRECTAS - EMAIL',
            });
        }

        if (!bcrypt.compareSync(body.password, data[0]['password'])) {
            return res.status(400).json({
                ok: false,
                mensaje: 'CREDENCIALES INCORRECTAS - PASSWORD',
            });
        }

        // crear token!
        if (data[0]['password']) { data[0]['password'] = ":)"; }
        var token = jwt.sign({ usuario: data }, SEED, { expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            usuario: data,
            token: token,
            idusuario: data[0]['idusuario']
        });
    });
});


// app.post('/', (req, res) => {
//     var body = req.body;
//     // var paramtro = body.email ? "email='" + body.email + "' and estado=0" : "usuario='" + body.usuario + "' and estado=0";
//     // valida por correo o usuario
//     var paramtro = "email='" + body.email + "' and estado=0";

//     usuario.findBy(paramtro, (err, data) => {
//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 mensaje: 'ERROR AL LOGUEAR',
//                 error: err
//             });
//         }
//         if (data.length === 0) {
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'CREDENCIALES INCORRECTAS - EMAIL',
//             });
//         }

//         if (!bcrypt.compareSync(body.password, data[0]['password'])) {
//             return res.status(400).json({
//                 ok: false,
//                 mensaje: 'CREDENCIALES INCORRECTAS - PASSWORD',
//             });
//         }

//         // crear token!
//         if (data[0]['password']) { data[0]['password'] = ":)"; }
//         var token = jwt.sign({ usuario: data }, SEED, { expiresIn: 14400 });

//         res.status(200).json({
//             ok: true,
//             usuario: data,
//             token: token,
//             idusuario: data[0]['idusuario']
//         });
//     });
// })

module.exports = app;