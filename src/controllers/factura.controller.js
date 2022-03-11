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

function carritoAfactura(req, res){
    const parametros = req.body;
    const facturaModel = new Factura();
    const productoId = req.params.idProducto;

     Usuario.findById(req.user.sub, (err, usuarioEncontrado)=>{
        
        if( parametros.nit) {
        facturaModel.nit = parametros.nit;
        facturaModel.listaProductos = usuarioEncontrado.carrito;
        facturaModel.idUsuario = req.user.sub;
        facturaModel.totalFactura = usuarioEncontrado.totalCarrito;
    
        facturaModel.save((err, facturaGuardada) => {
                if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
                if(!facturaGuardada) return res.status(404).send( { mensaje: "Error, no se agrego ningun producto"});
    
                return res.status(200).send({ producto: facturaGuardada });
            })
        }
    }) 

    Usuario.findByIdAndUpdate(req.user.sub, { $set: { carrito: [] }, totalCarrito: 0 }, { new: true }, 
        (err, carritoVacio)=>{
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
                if(!carritoVacio) return res.status(404).send( { mensaje: "Error, no se agrego ningun producto"});
    
    })

}

module.exports ={
    obtenerProductoVendidos,
    productosAgotados,
    carritoAfactura

}