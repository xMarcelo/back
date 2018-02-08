var express = require('express');
var bcrypt = require('bcryptjs'); //passoword
var mdVerificarToken = require('../middleware/autentificacion');

var app = express();
var usuario = require('../models/usuario');


// obtener todas las usuario
app.get('/', mdVerificarToken.verificarToken, (req, res, next) => {
    usuario.getAll((err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR EN BASE DE DATOS',
                error: err
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'Peticion realizada correctamente desde usuarioS',
            data: data
        });
    })

});

// modificar o actualizar usuario
app.put('/:id', mdVerificarToken.verificarToken, (req, res) => {
    var body = req.body;
    var colunma_datos = Object.keys(body).map(function(key) {
        var res;
        // si es password lo encrypta
        res = key.toLowerCase() === 'password' ? "'" + bcrypt.hashSync(body[key], 10) + "'" : "'" + body[key] + "'";
        res = key.toLowerCase() + "=" + res;

        return res;
    }).toString();

    usuario.updateById(req.params.id, colunma_datos, (err, data) => {
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
app.put('/delete/:id', mdVerificarToken.verificarToken, (req, res) => {
    usuario.delete(req.params.id, (err, data) => {
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


// agregar usuario
app.post('/', mdVerificarToken.verificarToken, (req, res) => {
    var body = req.body;
    var columnas = Object.keys(body).toString();
    var datos_columna = Object.keys(body).map(function(key) {
        var res;
        // si es password lo encrypta
        res = key.toLowerCase() === 'password' ? "'" + bcrypt.hashSync(body[key], 10) + "'" : "'" + body[key] + "'";
        return res;
    }).toString();

    usuario.add(columnas, datos_columna, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR AL INSERTAR usuario',
                error: err
            });
        }

        body.id = data;
        res.status(201).json({
            ok: true,
            data: body,
            usuariotoken: req.usuariotoken
        });
    })
});

// buscar por cualquier parametro
app.get('/por/', mdVerificarToken.verificarToken, (req, res) => {
    usuario.findBy(req.headers['parametros'], (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR AL BUSCAR BY',
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
        res.status(200).json({
            ok: true,
            data: data
        });
    });
})

// buscar por id
app.get('/:id', mdVerificarToken.verificarToken, (req, res) => {
    usuario.findByID(req.params.id, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'ERROR AL BUSCAR',
                error: err
            });
        }
        if (data.length === 0) {
            return res.status(400).json({
                ok: false,
                mensaje: 'NO SE ENCONTRO EL USUARIO',
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