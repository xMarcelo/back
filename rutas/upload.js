var express = require('express');
var fs = require('fs');
var fileUpload = require('express-fileupload');
var app = express();

// default options
app.use(fileUpload());
var apiGEN = require('../models/apigen');


// subir archivo con opcion de actualizar registro relacionado si se especifica los headers: tabla, id, campoupdate
// el id del url es el id global -- que puede ser idsede -- para evitar duplicados 

app.put('/', (req, res, next) => {
    var body = req.body;
    var tabla = body.tabla;
    var id = body.id === undefined ? 0 : body.id;
    var campoupdate = body.campoupdate;
    // var idglobal = req.params.id;

    // console.log(body);

    var path = body.path;
    var datos_api_model = {};

    if (path === undefined) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Debe especificar la ruta - headers[path]' + path
        });
    } else {
        // comprobamos si existe la carpeta a mover
        try {
            fs.statSync(path).isDirectory();
        } catch (e) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se encontro carpeta destino: ' + path,
                errors: e
            });
        }
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se encontro ningun archivo'
        });
    }

    var fileList = req.files.file;
    var archivo;
    var pathmover;
    var NombreArchivosBD = '';

    if (fileList.length) {
        //for (archivo in fileList) {
        // if (fileList.hasOwnProperty(key)) {
        //     archivo = fileList[key];

        // }
        // }
        fileList.forEach(archivo => {

            // });
            // for (archivo in fileList) {

            NombreArchivosBD += archivo.name + ',';
            pathmover = path + '/' + archivo.name;

            archivo.mv(pathmover, err => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al mover archivo',
                        errors: err
                    });
                }
            });
        });


        NombreArchivosBD = NombreArchivosBD.slice(0, -1);
        datos_api_model = {
            tabla: tabla,
            valid: id,
            campoupdate: campoupdate,
            path: path,
            nombreArchivo: NombreArchivosBD,
            datos_columna: campoupdate + "='" + NombreArchivosBD + "'"
        };

        //actualiza registro relacionado si se especifico headers     
        if (datos_api_model.tabla === undefined) {
            return res.status(200).json({
                ok: true,
                mensaje: 'Archivo subido correctamente',
                nombre_archivo: datos_api_model.nombreArchivo
            });
        } else {
            updateRegistroRelacionado(datos_api_model, res);
        }
    } else {
        archivo = fileList;
        NombreArchivosBD += archivo.name + ',';
        pathmover = path + '/' + archivo.name;

        archivo.mv(pathmover, err => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al mover archivo',
                    errors: err
                });
            }

            NombreArchivosBD = NombreArchivosBD.slice(0, -1);
            datos_api_model = {
                tabla: tabla,
                valid: id,
                campoupdate: campoupdate,
                path: path,
                nombreArchivo: NombreArchivosBD.slice(0, -1),
                datos_columna: campoupdate + "='" + NombreArchivosBD + "'"
            };

            //actualiza registro relacionado si se especifico headers     
            if (datos_api_model.tabla === undefined) {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Archivo subido correctamente',
                    nombre_archivo: datos_api_model.nombreArchivo
                });
            } else {
                updateRegistroRelacionado(datos_api_model, res);
            }
        });
    }
});


function updateRegistroRelacionado(datos_api_model, res) {
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
        var pathArchivoViejo = datos_api_model.path + '/' + data[0][datos_api_model.campoupdate];
        if (fs.existsSync(pathArchivoViejo)) {
            fs.unlink(pathArchivoViejo);
        }

        //actualiza datos            
        apiGEN.updateById(datos_api_model, (err, data) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'ERROR AL ACTUALIZAR DATOS - en ' + [datos_api_model.tabla] + ' /:tabla/:id',
                    error: err
                });
            }

            return res.status(200).json({
                ok: true,
                mensaje: 'Archivo subido correctamente. Registro actualizado!',
                nombre_archivo: datos_api_model.nombreArchivo
            });
        });
    });
}



module.exports = app;