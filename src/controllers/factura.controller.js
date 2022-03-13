const Factura = require('../models/factura.model')
const Producto = require('../models/producto.model')
const Usuario = require('../models/usuario.model')

function productosAgotados(req, res) {

    Producto.find({ cantidad: 0 }, (err, productoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        //if (!productoEncontrado) return res.status(404).send({ mensaje: "no hay productos agotados" });


        if (productoEncontrado.length == 0) {
            return res.status(500).send({ mensaje: "en este momento no tenemos productos agotados" })

        } else {

            return res.status(200).send({ productos: productoEncontrado });

        }



    })

}


function obtenerProductoVendidos(req, res) {
    Producto.find((err, productosEncontrados) => {
        if (err) return res.status(500).send({ mensaje: "error en la peticion" })
        if (!productosEncontrados) return res.status(500).send({ mensaje: "no existe ningun producto en la base de datos" })
        for (let i = 0; i < productosEncontrados.length; i++) {
        }

        return res.status(200).send({ productos: productosEncontrados })
    }).sort({
        vendido: -1
    })

}

function obtenerFacturas(req, res) {
    var idUser = req.params.idUsuario;

    Factura.find({idUsuario: idUser}, (err, facturasEncontradas)=>{
        if(err) return res.status(500).send({mensaje: "error en la peticion"})

        if(facturasEncontradas.length == 0) {
            return res.status(200).send({mensaje: "el usuario no posee facturas aun"})

        }else{
            return res.status(200).send({facturas: facturasEncontradas})

        }
    })


}

function obtenerProductosFactura(req, res) {
    var idFac = req.params.idFactura;

    Factura.findById(idFac, (err, facturaEncontrada)=>{
        if (err) return res.status(500).send({mensaje: "error en la peticion"})
        if (!facturaEncontrada) return res.status(500).send({mensaje: "no se encontro ninguna factura con este ID"})
        return res.status(200).send({Productos: facturaEncontrada.listaProductos})
           
        
    })
}

function carritoAfactura(req, res) {
    var usuario = req.user.sub;
    var parametros = req.body;
    const facturaModel = new Factura();
    Usuario.findById(usuario, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "error en la peticion" })
        if (!usuarioEncontrado) return res.status(500).send({ mensaje: "no se encontro el usuario" })
        if(usuarioEncontrado.carrito.length == 0){
            return res.status(500).send({ mensaje: "no ha agregado ningun producto aun a su carrito"})
        }else{
        if (parametros.nit) {
            facturaModel.nit = parametros.nit
            facturaModel.idUsuario = usuario;
            facturaModel.listaProductos = usuarioEncontrado.carrito;
            facturaModel.totalFactura = usuarioEncontrado.totalCarrito;
            facturaModel.save((err, facturaGuardada) => {
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                if (!facturaGuardada) return res.status(500).send({ mensaje: "Ocurrio un error al intentar guardar la factura" })
                for (let i = 0; i < usuarioEncontrado.carrito.length; i++) {
                    Producto.findOneAndUpdate({ nombre: usuarioEncontrado.carrito[i].nombreProducto },
                        {
                            $inc: {
                                cantidad: usuarioEncontrado.carrito[i].cantidadComprada * -1,
                                vendido: usuarioEncontrado.carrito[i].cantidadComprada
                            }
                        }, (err, datosProducto) => {
                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                            if (!datosProducto) return res.status(500).send({ mensaje: 'Ocurrio un error al modificar el stock' })
                        })
                }
                Usuario.findByIdAndUpdate(req.user.sub, { $set: { carrito: [] }, totalCarrito: 0 }, { new: true }, (err, carritoVacio) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' })
                    return res.status(200).send({ factura: facturaGuardada })
                })
            })

        } else {
            facturaModel.nit = "consumidor final"
            facturaModel.idUsuario = usuario;
            facturaModel.listaProductos = usuarioEncontrado.carrito;
            facturaModel.totalFactura = usuarioEncontrado.totalCarrito;
            facturaModel.save((err, facturaGuardada) => {
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                if (!facturaGuardada) return res.status(500).send({ mensaje: "error al intentar guardar la factura" })
                for (let i = 0; i < usuarioEncontrado.carrito.length; i++) {
                    Producto.findOneAndUpdate({ nombre: usuarioEncontrado.carrito[i].nombreProducto },
                        {
                            $inc: {
                                cantidad: usuarioEncontrado.carrito[i].cantidadComprada * -1,
                                vendido: usuarioEncontrado.carrito[i].cantidadComprada
                            }
                        }, (err, datosProducto) => {
                            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                            if (!datosProducto) return res.status(500).send({ mensaje: "no se pudo actualizar el stock" })

                        })
                }

                Usuario.findByIdAndUpdate(req.user.sub, { $set: { carrito: [] }, totalCarrito: 0 }, { new: true }, (err, carritoVacio) => {
                    if (err) return res.status(500).send({ mensaje: "error en la peticion" })
                    return res.status(200).send({ factura: facturaGuardada })
                })
            })
        }
    }
    })
}

module.exports = {
    obtenerProductoVendidos,
    productosAgotados,
    carritoAfactura,
    obtenerProductosFactura,
    obtenerFacturas

}