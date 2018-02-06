var express = require('express');
var bcrypt = require('bcryptjs'); //passoword

var app = express();
var frase = require('../models/frase')


// obtener todas las frases
app.get('/', (req, res, next) => {
    frase.getAll((err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR EN BASE DE DATOS',
                error: err
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'Peticion realizada correctamente desde FRASES',
            data: data
        });
    })

});

// modificar o actualizar frase
app.put('/:id', (req, res) => {
    var body = req.body;
    var colunma_datos = Object.keys(body).map(function(key) {
        var res;
        // si es password lo encrypta
        res = key.toLowerCase() === 'password' ? "'" + bcrypt.hashSync(body[key], 10) + "'" : "'" + body[key] + "'";
        res = key.toLowerCase() + "=" + res;

        return res;
    }).toString();

    frase.updateById(req.params.id, colunma_datos, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR AL ACTUALIZAR DATOS',
                error: err
            });
        }

        res.status(200).json({
            ok: true,
            data: data
        });
    })
})

// borrado logico
app.put('/delete/:id', (req, res) => {
    frase.delete(req.params.id, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR AL BORRAR DATOS',
                error: err
            });
        }
        res.status(200).json({
            ok: true,
            data: data
        });
    })
})


// agregar frase
app.post('/', (req, res) => {
    var body = req.body;
    var columnas = Object.keys(body).toString();
    var datos_columna = Object.keys(body).map(function(key) {
        var res;
        // si es password lo encrypta
        res = key.toLowerCase() === 'password' ? "'" + bcrypt.hashSync(body[key], 10) + "'" : "'" + body[key] + "'";
        return res;
    }).toString();

    // res.status(201).json({
    //     ok: true,
    //     data: datos_columna
    // });
    frase.add(columnas, datos_columna, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR AL INSERTAR FRASE',
                error: err
            });
        }

        res.status(201).json({
            ok: true,
            data: datos_columna
        });
    })
});

module.exports = app;