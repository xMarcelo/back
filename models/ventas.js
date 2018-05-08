var db = require('../conexionbd');
var xfunciones = require('../middleware/funciones');
var xcrud_generales = require('../models/crud_generales');
var otrosDatosRecibidos = {}; //datos recibidos desde backfront

var apiVentas = {

    /// distribuicion
    ventas: function(datos_recibidos, callback) {
        var rpt;
        var sql = '';
        var idorg = datos_recibidos.usuario[0].idorg;
        var idsede = datos_recibidos.usuario[0].idsede;
        var idusuario = datos_recibidos.usuario[0].idusuario;
        var seccion = datos_recibidos.seccion;
        otrosDatosRecibidos = datos_recibidos.otrosDatos;

        switch (seccion) {
            case 'venta':
                switch (datos_recibidos.opcion) {
                    case '1': // guadar venta
                        var xdt_cliente = otrosDatosRecibidos[0];
                        var xdt_venta = otrosDatosRecibidos[1];
                        var xdt_venta_detalle = otrosDatosRecibidos[2];
                        var xdt_venta_pago_detalle = otrosDatosRecibidos[3];
                        var xdt_update_stock = otrosDatosRecibidos[4];

                        // grabar cliente                        
                        xdt_cliente.valuesPOST = xfunciones.addItemArray(xdt_cliente.valuesPOST, [idorg]);

                        var idcliente = xdt_cliente.id; // veridicar si viene con idcliente entonces se toma el id y no se crea como nuevo, de lo contrario se inserta nuevo cliente
                        if (idcliente !== undefined) { xdt_cliente = null; }
                        xcrud_generales.insert(xdt_cliente, function(err, data) {
                            if (err) { return callback(err); }
                            idcliente = data === undefined ? idcliente : data.insertId;

                            xdt_venta.valuesPOST = xfunciones.addItemArray(xdt_venta.valuesPOST, [idorg, idsede, idcliente, idusuario, xfunciones.fechaActual(), xfunciones.horaActual()], false);

                            // grabar venta                            
                            xcrud_generales.insert(xdt_venta, function(err, data) {
                                if (err) { return callback(err); }

                                var idventa = data.insertId;
                                xdt_venta_detalle.valuesPOST = xfunciones.addItemArray(xdt_venta_detalle.valuesPOST, [idventa], true);

                                // grabar detalles de venta                                
                                xcrud_generales.insert(xdt_venta_detalle, function(err, data) {
                                    if (err) { return callback(err); }

                                    // grabar detalles de pago                                    
                                    xdt_venta_pago_detalle.valuesPOST = xfunciones.addItemArray(xdt_venta_pago_detalle.valuesPOST, [idventa], true);
                                    xcrud_generales.insert(xdt_venta_pago_detalle, function(err, data) {
                                        if (err) { return callback(err); }

                                        // descontar stock en producto_stock
                                        var sql_head = `update ${xdt_update_stock.tabla} set stock = stock - ? where idproducto_stock = ?; `;
                                        xcrud_generales.update(xdt_update_stock, sql_head, callback);
                                    });
                                });
                            });
                        });
                        break;
                }
                break;

            default:
                break;
        }
        // console.log('final', rpt);
        // return rpt;
    }
};

module.exports = apiVentas;