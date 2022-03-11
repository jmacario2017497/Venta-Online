const Categoria = require('../models/categoria.model');
const Producto = require('../models/producto.model');

function agregarCategoria(req, res) {
    var parametros = req.body;
    var categoriaModel = new Categoria();

    if (parametros.nombre) {
        categoriaModel.nombre = parametros.nombre

        categoriaModel.save((err, categoriaAgregada) => {
            if (err) return res.status(500).send({ mensaje: "error en la peticion", error: err });
            if (!categoriaAgregada) return res.status(500).send({ mensaje: "error al intentar agregar la categoria" });

            return res.status(200).send({ categoria: categoriaAgregada })
        })
    }
}

function obtenerCategorias(req, res) {
    Categoria.find((err, categoriasObtenidas) => {
        if (err) return res.status(500).send({ mensaje: "error en la peticion" })
        if (!categoriasObtenidas) return res.status(500).send({ mensaje: "no hay categorias encontradas" })

        for (let i = 0; i < categoriasObtenidas.length; i++) {
            console.log(categoriasObtenidas[i].nombre)
        }

        return res.status(200).send({ categorias: categoriasObtenidas })
    })
}

function editarCategoria(req, res) {
    var idCat = req.params.idCategoria;
    var parametros = req.body;

    Categoria.findByIdAndUpdate(idCat, parametros, { new: true }, (err, categoriaEditada) => {
        if (err) return res.status(500).send({ mensaje: "error en la peticion" })
        if (!categoriaEditada) return res.status(500).send({ mensaje: "no se encontro ninguna categoria con ese ID" })

        return res.status(200).send({ categoria: categoriaEditada })
    })
}

function eliminarCategoria(req, res) {
    var idCat = req.params.idCategoria;

    Categoria.findOne({ nombre: "Por Defecto" }, (err, categoriaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "error en la peticion" })
        if (!categoriaEncontrada) {
            const categoriaModel = new Categoria();
            categoriaModel.nombre = "Por Defecto"

            categoriaModel.save((err, categoriaAgregada) => {
                if (err) return res.status(500).send({ mensaje: "error en la peticion" })
                if (!categoriaAgregada) return res.status(500).send({ mensaje: "no se ha podido agregar la categoria" })

                Producto.updateMany({ categoria: idCat }, { categoria: categoriaAgregada._id }, (err, productosActualizados) => {
                    if (err) return res.status(500).send({ mensaje: "error en la peticion" })

                    Categoria.findByIdAndDelete(idCat, (err, categoriaEliminada) => {
                        if (err) return res.status(500).send({ mensaje: "error en la peticion" })
                        if (!categoriaEliminada) return res.status(500).send({ mensaje: "error al intentar eliminar la categoria" })

                        return res.status(200).send({
                            editados: productosActualizados,
                            eliminada: categoriaEliminada
                        })
                    })
                })
            })
        } else {
            Producto.updateMany({ categoria: idCat }, { categoria: categoriaEncontrada._id }, (err, productosActualizados1) => {
                if (err) return res.status(500).send({ mensaje: "error en la peticion" })
                Categoria.findByIdAndDelete(idCat, (err, categoriaEliminada) => {
                    if (err) return res.status(500).send({ mensaje: "error en la peticion" })
                    return res.status(200).send({ producto: productosActualizados1, eliminada: categoriaEliminada })

                })
            })
        }
    })

}

function buscarCategoriaNombre(req, res) {
    const parametros = req.body;

    Categoria.findOne({ nombre: { $regex: parametros.categoria, $options: 'i' } }, (err, categoriaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "error en la peticion" })
        if (!categoriaEncontrada) return res.status(500).send({ mensaje: "no se encontro ninguna categoria parecida a esta" })


        Producto.find({ categoria: categoriaEncontrada._id }, (err, productosEncontrados) => {

            if (err) return res.status(500).send({ mensaje: "error en la peticion" })
            if (productosEncontrados.length == 0) return res.status(500).send({ mensaje: "no se hay ningun producto registrado en esta categoria" })

            return res.status(200).send({ productos: productosEncontrados })
        })
    

    })
}




module.exports = {
    agregarCategoria,
    obtenerCategorias,
    editarCategoria,
    eliminarCategoria,
    buscarCategoriaNombre
}