const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    nombre: String,
    descripcion: String,
    precio: Number,
    cantidad: Number,
    vendido: Number,
    categoria: {
        type: Schema.Types.ObjectId, ref: 'Categorias'
    }
})

module.exports = mongoose.model('Productos', ProductoSchema);