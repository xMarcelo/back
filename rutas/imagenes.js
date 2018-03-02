var express = require('express');
var app = express();
var fs = require('fs');
var datos_api_model = {};

app.get('/:img', (req, res, next) => {
    var img = req.params.img;
    var path = `./uploads/${img}`;

    fs.exists(path, existe => {
        if (!existe) { path = './assets/no-img.jpg' }
        res.sendfile(path);
    });

    // res.status(200).json({
    //     ok: true,
    //     mensaje: path
    // });
});

module.exports = app;