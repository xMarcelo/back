var db = require('../conexionbd');

var frase = {
    getAll: function(callback) {
        return db.query('select * from frase where estado=0', callback);
    },
    add: function(columnas, datos_columna, callback) {
        var sql = "Insert into frase (" + columnas + ")values(" + datos_columna + ")";
        return db.query(sql, callback);
    },
    delete: function(id, callback) {
        return db.query("update frase set estado=1 where id=" + id, callback);
    },
    updateById: function(id, datos, callback) {
        var sql = "update frase set " + datos + " where id=" + id;
        return db.query(sql, callback);
    },
    findBy: function(columna, dato_buscar, callback) {
        var sql = "select * from frase where " + columna + "=" + dato_buscar;

        return db.query(sql, callback);
    }
}

module.exports = frase;