var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

// default options
app.use(fileUpload());
var apiGEN = require('../models/apigen');


// subir archivo con opcion de actualizar registro relacionado si se especifica los headers: tabla, id, campoupdate
// el id del url es el id global -- que puede ser idsede -- para evitar duplicados 

app.put('/:id', (req, res, next) => {
    var body = req.body;
    var tabla = body.tabla;
    var id = body.id === undefined ? 0 : body.id;
    var campoupdate = body.campoupdate;
    var idglobal = req.params.id;

    var path = body.path;
    var datos_api_model = {};

    if (path === undefined) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Debe especificar la ruta - headers[path]' + path
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se encontro ningun archivo'
        });
    }

    var archivo = req.files.file;
    var extension = archivo.name.split('.');
    extension = extension[extension.length - 1];

    // extensiones permitidas
    var extensionesPermitidas = ['png', 'jpg', 'jpeg', 'doc', 'xls'];
    if (extensionesPermitidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no permitidas. Solo se aceptan: ' + extensionesPermitidas.join(', ')
        });
    }

    // renombrar archivo
    var nombreArchivo = `${idglobal}-${id}-${new Date().getMilliseconds()}.${extension}`;
    var pathmover = `${path}/${nombreArchivo}`;

    archivo.mv(pathmover, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo a:' + pathmover,
                error: err
            });
        }

        datos_api_model = {
            tabla: tabla,
            valid: id,
            campoupdate: campoupdate,
            path: path,
            nombreArchivo: nombreArchivo,
            datos_columna: campoupdate + "='" + nombreArchivo + "'"
        }

        //actualiza registro relacionado si se especifico headers        
        updateRegistroRelacionado(datos_api_model, res)
    });
});


function updateRegistroRelacionado(datos_api_model, res) {
    //actualiza registro relacionado si se especifico headers
    if (datos_api_model.tabla !== undefined && datos_api_model.valid !== 0 && datos_api_model.campoupdate !== undefined) {

        //verificar si ya tiene archivo relacionado el registro y eliminarlo del repositorio
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

            //si ya existe lo elimina
            var pathArchivoViejo = `${datos_api_model.path}/${data[0][datos_api_model.campoupdate]}`;
            if (fs.existsSync(pathArchivoViejo)) {
                fs.unlink(pathArchivoViejo);
            }

            //actualiza datos
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
                    mensaje: 'Archivo subido correctamente. Registro actualizado!',
                    nombre_archivo: datos_api_model.nombreArchivo
                });
            });
        });
    } else {
        res.status(200).json({
            ok: true,
            mensaje: 'Archivo subido correctamente',
            nombre_archivo: datos_api_model.nombreArchivo
        });
    }
}

module.exports = app;