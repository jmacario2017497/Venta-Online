const express = require('express');
const productoController = require('../controllers/producto.controller')
const md_autenticacion = require('../middlewares/autenticacion')
const verificarRol = require('../middlewares/rol')

const api = express.Router();

api.post('/agregarProducto', [md_autenticacion.Auth, verificarRol.administrador], productoController.agregarProducto)
api.get('/obtenerProductos', md_autenticacion.Auth, productoController.obtenerProducto)

api.get('/obtenerProductosNombre', md_autenticacion.Auth, productoController.buscarProductoNombre)

api.put('/editarProducto/:idProducto', [md_autenticacion.Auth, verificarRol.administrador], productoController.editarProdcuto)
api.delete('/eliminarProducto/:idProducto', [md_autenticacion.Auth, verificarRol.administrador], productoController.eliminarProducto)
api.put('/controlStock/:idProducto', [md_autenticacion.Auth, verificarRol.administrador], productoController.controlStock)

module.exports = api;


