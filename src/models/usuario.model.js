const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UsuarioSchema = Schema({
    nombre: String,
    apellido: String,
    email: String,
    Usuario: String,
    password: String,
    rol: String,
    carrito: [{
        nombreProducto: String,
        cantidadComprada: Number,
        precioUnitario: Number,
        subTotal: Number
    }],
    totalCarrito: Number

});

module.exports = mongoose.model('Usuarios', UsuarioSchema);