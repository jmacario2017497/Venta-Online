const express = require('express');
const facturaController = require('../controllers/factura.controller')
const md_autenticacion = require('../middlewares/autenticacion')
const verificarRol = require('../middlewares/rol')
const api = express.Router();

api.get('/obtenerPrductosMasVendidos', [md_autenticacion.Auth, verificarRol.administrador], facturaController.obtenerProductoVendidos)
api.get('/productosAgotados', [md_autenticacion.Auth, verificarRol.administrador], facturaController.productosAgotados)
api.post('/productoAcarrito', md_autenticacion.Auth, facturaController.carritoAfactura)


module.exports = api;


