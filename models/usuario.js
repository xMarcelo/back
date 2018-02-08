var db = require('../conexionbd');

var usuario = {
    getAll: function(callback) {
        return db.query('select * from usuario where estado=0', callback);
    },
    add: function(columnas, datos_columna, callback) {
        var sql = "Insert into usuario (" + columnas + ")values(" + datos_columna + ")";
        return db.query(sql, (err, result) => {
            if (err) throw err;
            //devolvemos la última id insertada
            callback(null, result.insertId);
        });
    },
    delete: function(id, callback) {
        return db.query("update usuario set estado=1 where idusuario=" + id, callback);
    },
    updateById: function(id, datos, callback) {
        var sql = "update usuario set " + datos + " where idusuario=" + id;
        return db.query(sql, callback);
    },
    findByID: function(id, callback) {
        var sql = "select * from usuario where idusuario=" + id;
        return db.query(sql, callback);
    },
    findBy: function(params, callback) {
        var sql = "select * from usuario where " + params;
        return db.query(sql, callback);
    }
}

module.exports = usuario;