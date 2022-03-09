const Categoria = require('../models/categoria.model');

function agregarCategoria(req, res) {
    var parametros = req.body;
    var categoriaModel = new Categoria();

    if(parametros.nombre){
        categoriaModel.nombre = parametros.nombre

        categoriaModel.save((err, categoriaAgregada)=>{
            if(err) return res.status(500).send({mensaje: "error en la peticion", error: err});
            if(!categoriaAgregada) return res.status(500).send({mensaje: "error al intentar agregar la categoria"});

            return res.status(200).send({categoria: categoriaAgregada})
        })
    }
}

function obtenerCategorias(req, res) {
    Categoria.find((err, categoriasObtenidas)=>{
        if(err) return res.status(500).send({mensaje: "error en la peticion"})
        if(!categoriasObtenidas) return res.status(500).send({mensaje: "no hay categorias encontradas"})

        for(let i=0; i<categoriasObtenidas.length; i++){
            console.log(categoriasObtenidas[i].nombre)
        }

        return res.status(200).send({categorias: categoriasObtenidas})
    })
}

function editarCategoria (req, res) {
    var idCat = req.params.idCategoria;
    var parametros = req.body;

    Categoria.findByIdAndUpdate(idCat, parametros, {new : true}, (err, categoriaEditada)=>{
        if(err) return res.status(500).send({mensaje: "error en la peticion"})
        if(!categoriaEditada) return res.status(500).send({mensaje: "no se encontro ninguna categoria con ese ID"})

        return res.status(200).send({categoria: categoriaEditada})
    })



}


module.exports = {
    agregarCategoria,
    obtenerCategorias,
    editarCategoria
}