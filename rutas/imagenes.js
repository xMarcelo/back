var express = require('express');
var fs = require('fs');

var app = express();
var datos_api_model = {};

app.get('/:img', (req, res, next) => {
    var img = req.params.img;
    var path = './uploads/' + img;

    fs.exists(path, existe => {

        if (!existe) {
            path = './assets/no-img.jpg';
        }


        res.sendfile(path);
    });

});

module.exports = app;