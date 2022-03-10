//const { findOneAndUpdate } = require('../models/producto.model');
const Producto = require('../models/producto.model')

function agregarProducto(req, res) {
    var productoModel = new Producto();
    var parametros = req.body;

    if (parametros.nombre && parametros.precio && parametros.cantidad && parametros.categoria) {


        Producto.findOne({ nombre: { $regex: parametros.nombre, $options: 'i' } }, (err, productoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });


            if (productoEncontrado) {
                return res.status(500).send({ mensaje: "este producto ya se encuentra registrado en la base de datos" })

            } else {
                productoModel.nombre = parametros.nombre;
                productoModel.descripcion = parametros.descripcion;
                productoModel.precio = parametros.precio;
                productoModel.cantidad = parametros.cantidad;
                productoModel.categoria = parametros.categoria;
                productoModel.vendido = 0;

                productoModel.save((err, productoAgregado) => {
                    if (err) return res.status(500).send({ mensaje: "error en la peticion" })
                    if (!productoAgregado) return res.status(500).send({ mensaje: "no se pudo agregar el producto" })

                    return res.status(200).send({ producto: productoAgregado })
                })
            }
        })
    } else {
        return res.status(500).send({ mensaje: "debe de llenar todo lo campos" })
    }
}

function obtenerProducto(req, res) {
    Producto.find((err, productosEncontrados) => {
        if (err) return res.status(500).send({ mensaje: "error en la peticion" })
        if (!productosEncontrados) return res.status(500).send({ mensaje: "no existe ningun producto en la base de datos" })
        for (let i = 0; i < productosEncontrados.length; i++) {
            console.log(productosEncontrados[i].nombre);
            console.log(productosEncontrados[i].descripcion);
            console.log(productosEncontrados[i].cantidad);
            console.log(productosEncontrados[i].precio)
            console.log(productosEncontrados[i].categoria)
        }

        return res.status(200).send({ productos: productosEncontrados })
    })

}

function buscarProductoNombre(req, res){
    var nomProd = req.params.nombreProd;

    Producto.find({nombre: { $regex: nomProd, $options: 'i' }}, (err, productoEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: "error en la peticion"})
        if(!productoEncontrado) return res.status(500).send({ mensaje: "error al intentar buscar el producto"})

        return res.status(200).send({producto: productoEncontrado})
    })
}

function editarProdcuto(req, res) {
    var idProd = req.params.idProducto;
    var parametros = req.body;

    Producto.findByIdAndUpdate(idProd, parametros, { new: true }, (err, productoActualizado) => {
        if (err) return res.status(500).send({ mensaje: "error en la peticion" })
        if (!productoActualizado) return res.status(500).send({ mensaje: "el producto no se encuentra registrado" })

        return res.status(200).send({ producto: productoActualizado })
    })
}

function controlStock(req, res) {
    var idProd = req.params.idProducto;
    var parametros = req.body;

    Producto.findByIdAndUpdate(idProd, { $inc: { cantidad: parametros.cantidad } }, { new: true },
        (err, productoModificado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!productoModificado) return res.status(500).send({ mensaje: 'Error al editar la cantidad del Producto' });

        return res.status(200).send({ producto: productoModificado });

    })

}




module.exports = {
    agregarProducto,
    obtenerProducto,
    buscarProductoNombre,
    editarProdcuto,
    controlStock
}