var db = require('../conexionbd');

// criterios sql
var tabla = '',
    id = '',
    columnas = '',
    datos_columna = '',
    condiciones_de_busqueda = '',
    paginacion_desde = 0,
    paginacion_filas = 0; // cuantas filas mostrar en paginacion



function evaluarCriteriosSql(datos) {
    tabla = datos.tabla;
    valid = datos.valid;
    columnas = datos.columnas;
    datos_columna = datos.datos_columna;
    condiciones_de_busqueda = datos.condiciones_de_busqueda;
    paginacion_desde = datos.paginacion_desde;
    paginacion_filas = datos.paginacion_filas;
}

function paginar(_sql) {
    var sql = _sql;
    var des_limit = '';
    if (paginacion_filas !== 0 && paginacion_filas !== undefined) {
        des_limit = ' limit ' + paginacion_desde + ',' + paginacion_filas;
    }
    return sql + des_limit;
}

var apiGEN = {
    count: function(datos, callback) {
        evaluarCriteriosSql(datos);
        return db.query('SELECT count(*) count FROM ' + tabla + ' ' + condiciones_de_busqueda, callback);
    },
    getAll: function(datos, callback) {
        evaluarCriteriosSql(datos);
        return db.query(paginar('select * from ' + tabla + ' ' + condiciones_de_busqueda), callback);
    },
    add: function(datos, callback) {
        evaluarCriteriosSql(datos);
        var sql = "Insert into " + tabla + " (" + columnas + ")values(" + datos_columna + ")";
        //return db.query(sql, callback);
        return db.query(sql, function(err, result, fields) {
            if (err) return callback(err);
            //devolvemos la última id insertada
            callback(null, result.insertId);
        });
    },
    delete: function(datos, callback) {
        evaluarCriteriosSql(datos);
        return db.query("update " + tabla + " set estado=1 where id" + tabla + "=" + valid, callback);
    },
    updateById: function(datos, callback) {
        evaluarCriteriosSql(datos);
        var sql = "update " + tabla + " set " + datos_columna + " where id" + tabla + "=" + valid;
        return db.query(sql, callback);
    },
    findByID: function(datos, callback) {
        evaluarCriteriosSql(datos);
        var sql = "select * from " + tabla + " where id" + tabla + "=" + valid;
        return db.query(sql, callback);
    },
    findBy: function(datos, callback) {
        evaluarCriteriosSql(datos);
        var sql = "select * from " + tabla + " " + condiciones_de_busqueda;
        return db.query(paginar(sql), callback);
    }
}

module.exports = apiGEN;