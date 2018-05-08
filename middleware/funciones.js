exports.paginar = function(otrosDatosRecibidos, _sql) {
    var sql = _sql;
    var des_limit = '';
    if (otrosDatosRecibidos.paginacion_filas !== 0 && otrosDatosRecibidos.paginacion_filas !== undefined) {
        des_limit = ' limit ' + otrosDatosRecibidos.paginacion_desde + ',' + otrosDatosRecibidos.paginacion_filas;
    }
    return sql + des_limit;
};

/// agrega item valor en arrraypost por ejemplo idorg
// valAdd: any
exports.addItemArray = function(_arr, valAdd, insertPrimero = true) {
    for (var index = 0; index < _arr.length; index++) {
        for (var val of valAdd) {
            if (insertPrimero) {
                _arr[index].unshift(val);
            } else {
                _arr[index].push(val);
            }
        }
    }
    return _arr;
};

exports.fechaActual = function() {
    // var f = new Date() ;
    // return f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();
    return new Date().toJSON().slice(0, 10);
};

exports.horaActual = function() {
    var d = new Date();
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    var s = addZero(d.getSeconds());
    return h + ":" + m + ":" + s;
};

function addZero(i) {
    if (i < 10) { i = "0" + i; }
    return i;
}