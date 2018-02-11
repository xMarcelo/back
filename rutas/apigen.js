var express = require('express');
var bcrypt = require('bcryptjs'); //passoword
var mdVerificarToken = require('../middleware/autentificacion');

var app = express();
var apiGEN = require('../models/apigen');

var datos_api_model = {};

// obtener todas las filas
app.get('/:tabla', mdVerificarToken.verificarToken, (req, res, next) => {
    datos_api_model = {
        tabla: req.params.tabla,
        condiciones_de_busqueda: req.headers['condiciones'],
        paginacion_desde: req.query.desde,
        paginacion_filas: req.query.filas
    }

    apiGEN.getAll(datos_api_model, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR EN BASE DE DATOS - ' + [datos_api_model.tabla] + ' - headers/condicones/ ?desde ?filas',
                error: err
            });
        }

        apiGEN.count(datos_api_model, (err, count) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'ERROR EN BASE DE DATOS - COUNT',
                    error: err
                });
            }

            res.status(200).json({
                ok: true,
                mensaje: 'Peticion realizada correctamente desde - ' + [datos_api_model.tabla],
                data: data,
                count: count[0]['count']
            });
        });
    });

});

// modificar 
app.put('/:tabla/:id', mdVerificarToken.verificarToken, (req, res) => {
    var body = req.body;
    var colunma_datos = Object.keys(body).map(function(key) {
        var res;
        // si es password lo encrypta
        res = key.toLowerCase() === 'password' ? "'" + bcrypt.hashSync(body[key], 10) + "'" : "'" + body[key] + "'";
        res = key.toLowerCase() + "=" + res;

        return res;
    }).toString();

    datos_api_model = {
        tabla: req.params.tabla,
        valid: req.params.id,
        datos_columna: colunma_datos
    }
    apiGEN.updateById(datos_api_model, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR AL ACTUALIZAR DATOS - en ' + [datos_api_model.tabla] + ' /:tabla/:id',
                error: err,
            });
        }

        res.status(200).json({
            ok: true,
            data: data
        });
    });
});

// borrado logico
app.put('/delete/:tabla/:id', mdVerificarToken.verificarToken, (req, res) => {
    datos_api_model = {
        tabla: req.params.tabla,
        valid: req.params.id
    }
    apiGEN.delete(datos_api_model, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR AL BORRAR DATOS - en ' + [datos_api_model.tabla],
                error: err
            });
        }
        res.status(200).json({
            ok: true,
            data: data
        });
    })
})


// agregar 
app.post('/:tabla', mdVerificarToken.verificarToken, (req, res) => {
    var body = req.body;
    var columnas = Object.keys(body).toString();
    var datos_columna = Object.keys(body).map(function(key) {
        var res;
        // si es password lo encrypta
        res = key.toLowerCase() === 'password' ? "'" + bcrypt.hashSync(body[key], 10) + "'" : "'" + body[key] + "'";
        return res;
    }).toString();

    datos_api_model = {
        tabla: req.params.tabla,
        columnas: columnas,
        datos_columna: datos_columna
    }

    apiGEN.add(datos_api_model, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR AL INSERTAR DATOS - ' + [datos_api_model.tabla],
                error: err
            });
        }

        if (body.password) { body.password = ":)"; }
        body.id = data;
        res.status(201).json({
            ok: true,
            data: body,
            usuariotoken: req.usuariotoken
        });
    })
});

// buscar por cualquier parametro
app.get('/buscarpor/:tabla', mdVerificarToken.verificarToken, (req, res) => {
    datos_api_model = {
        tabla: req.params.tabla,
        condiciones_de_busqueda: req.headers['condiciones'],
        paginacion_desde: req.query.desde,
        paginacion_filas: req.query.filas
    }
    apiGEN.findBy(datos_api_model, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR AL BUSCAR BY - en' + [datos_api_model.tabla] + ' / headers["condiciones"]',
                error: err
            });
        }
        if (data.length === 0) {
            return res.status(400).json({
                ok: false,
                mensaje: 'NO SE ENCONTRO NINGUN DATO',
            });
        }

        if (data[0]['password']) { data[0]['password'] = ":)"; }

        apiGEN.count(datos_api_model, (err, count) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'ERROR EN BASE DE DATOS - COUNT',
                    error: err
                });
            }

            res.status(200).json({
                ok: true,
                data: data,
                count: count[0]['count']
            });
        });
    });
})

// buscar por id
app.get('/:tabla/:id', mdVerificarToken.verificarToken, (req, res) => {
    datos_api_model = {
        tabla: req.params.tabla,
        valid: req.params.id
    }
    apiGEN.findByID(datos_api_model, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR AL BUSCAR - ' + [datos_api_model.tabla],
                error: err
            });
        }
        if (data.length === 0) {
            return res.status(400).json({
                ok: false,
                mensaje: 'NO SE ENCONTRO NINGUN REGISTRO',
            });
        }

        if (data[0]['password']) { data[0]['password'] = ":)"; }
        res.status(200).json({
            ok: true,
            data: data
        });
    })
})




module.exports = app;