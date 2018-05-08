var db = require('../conexionbd');

var otrosDatosRecibidos = {}; //datos recibidos desde backfront

// // criterios sql
// var tabla = '',
//     id = '',
//     columnas = '',
//     datos_columna = '',
//     condiciones_de_busqueda = '',
//     paginacion_desde = 0,
//     paginacion_filas = 0, // cuantas filas mostrar en paginacion
//     usuario,
//     opcion;


function paginar(_sql) {
    var sql = _sql;
    var des_limit = '';
    if (otrosDatosRecibidos.paginacion_filas !== 0 && otrosDatosRecibidos.paginacion_filas !== undefined) {
        des_limit = ' limit ' + otrosDatosRecibidos.paginacion_desde + ',' + otrosDatosRecibidos.paginacion_filas;
    }
    return sql + des_limit;
}


var apiLogistica = {

    /// distribuicion
    distribuicion: function(datos_recibidos, callback) {
        var rpt;
        var sql = '';
        var idorg = datos_recibidos.usuario[0].idorg;
        var idsede = datos_recibidos.usuario[0].idsede;
        var idusuario = datos_recibidos.usuario[0].idusuario;
        var otrosDatosRecibidos = datos_recibidos.otrosDatos;

        switch (datos_recibidos.opcion) {
            case '1': // listar productos en almacen origen
                sql = `SELECT pd.idproducto_detalle, ps.idproducto_stock, ps.idsede, concat(pd.codigobarras,' ',p.descripcion,' ',c.descripcion,' ', m.descripcion,' ', t.descripcion) as name, ps.stock, pd.precio1 as P1, pd.precio2 as P2 FROM producto_detalle AS pd	
                INNER JOIN producto_stock AS ps ON pd.idproducto_detalle=ps.idproducto_detalle
                INNER JOIN producto AS p ON pd.idproducto=p.idproducto
                INNER JOIN marca AS m ON p.idmarca=m.idmarca
                INNER JOIN talla AS t ON pd.idtalla=t.idtalla
                INNER JOIN color as c on pd.idcolor=c.idcolor
            WHERE (ps.idorg=${idorg} AND ps.idsede=${otrosDatosRecibidos.idalmacen} AND p.estado=0) and ps.stock>0
                AND concat(pd.codigobarras,' ',p.descripcion,' ',c.descripcion,' ', m.descripcion,' ', t.descripcion) LIKE '%${otrosDatosRecibidos.parametro}%'`;

                rpt = db.query(paginar(sql), callback);
                break;
            case '2': // guardar lista de distribuicion                
                // sql = `insert into ${otrosDatosRecibidos.tabla} (${otrosDatosRecibidos.campos}) values ?`;
                // rpt = db.query(sql, [otrosDatosRecibidos.valuesPOST], callback);
                var sqls = '';
                var sql_head = `insert into ${otrosDatosRecibidos.tabla} (${otrosDatosRecibidos.campos}) values `;
                otrosDatosRecibidos.valuesPOST.forEach(items => {
                    console.log(items[0]);
                    sqls += sql_head + `( (select ps.idproducto_stock from producto_stock as ps where ps.idproducto_detalle = ${items[0]} and ps.idsede = ${items[1]}), ${items[0]}, ${items[1]}, ${items[2]} ) ON DUPLICATE KEY UPDATE stock=stock+${items[2]}; `;
                });
                console.log(sqls);
                rpt = db.query(sqls, callback);
                break;
            case '3': // update stock distribuicion
                var sqls = '';
                var sql_head = `update ${otrosDatosRecibidos.tabla} set stock = stock - ?, stock=IF(stock<=0,0,stock) where idproducto_stock = ?; `;
                otrosDatosRecibidos.valuesPOST.forEach(items => {
                    sqls += db.format(sql_head, items);
                });
                rpt = db.query(sqls, callback);
                break;

        }
        return rpt;
    }
};

module.exports = apiLogistica;