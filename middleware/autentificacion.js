var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

exports.verificarToken = function(req, res, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'TOKEN INCORRECTO',
                error: err
            });
        }

        req.usuariotoken = decode.usuario;
        next();
        // return res.status(200).json({
        //     ok: true,
        //     decode: decode,
        // });
    });
}