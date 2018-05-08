var db = require('../conexionbd');

var datos = {}; //datos recibidos desde backfront

function paginar(_sql) {
    var sql = _sql;
    var des_limit = '';
    if (datos.paginacion_filas !== 0 && datos.paginacion_filas !== undefined) {
        des_limit = ' limit ' + datos.paginacion_desde + ',' + datos.paginacion_filas;
    }
    return sql + des_limit;
}


var apiMaestros = {

    /// distribuicion
    listas: function(datos_recibidos, callback) {
        var sql = '';
        var idorg = datos_recibidos.usuario[0].idorg;
        var idsede = datos_recibidos.usuario[0].idsede;
        var idusuario = datos_recibidos.usuario[0].idusuario;
        var tabla = datos_recibidos.tabla; // para listas generale opcion 0

        datos = datos_recibidos;
        switch (datos_recibidos.opcion) {
            case '0': // listas de org generales
                sql = `select * from ${tabla} where idorg=${idorg} and estado=0`;
                break;
            case '1': // listar sedes - almacenes
                sql = `SELECT s.* FROM sede AS s WHERE s.idorg=${idorg} and s.estado=0 ORDER BY s.descripcion`;
                break;
            case '2': // listas generales
                sql = `select * from ${tabla} where estado=0`;
                break;
        }

        return db.query(paginar(sql), callback);
    }
};

module.exports = apiMaestros;