var db = require('../conexionbd');
var sql = '';

apiCrudGenerales = {
    insert: function(otrosDatosRecibidos, callback) { // insert sin filtros ej: clientes
        console.log('otros datos crud', otrosDatosRecibidos); // si ya tiene id de tabla entonces no se inserta como nuevo se devuelve null para tomar el id enviado     
        if (otrosDatosRecibidos == null) { return callback(null); }
        sql = `insert into ${otrosDatosRecibidos.tabla} (${otrosDatosRecibidos.campos}) values ?`;
        return db.query(sql, [otrosDatosRecibidos.valuesPOST], callback);
    },
    update: function(otrosDatosRecibidos, sql_head, callback) {
        // update una o varias lineas  ej: sql_head = `update ${otrosDatosRecibidos.tabla} set stock = stock - ?, stock=IF(stock<=0,0,stock) where idproducto_stock = ?; `;        
        var sqls = '';
        otrosDatosRecibidos.valuesPOST.forEach(items => {
            sqls += db.format(sql_head, items);
        });
        return db.query(sqls, callback);
    }
};

module.exports = apiCrudGenerales;