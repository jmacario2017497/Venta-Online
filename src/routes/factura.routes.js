const express = require('express');
const facturaController = require('../controllers/factura.controller')
const md_autenticacion = require('../middlewares/autenticacion')
const verificarRol = require('../middlewares/rol')
const api = express.Router();

api.get('/obtenerPrductosMasVendidos', md_autenticacion.Auth, facturaController.obtenerProductoVendidos)
api.get('/productosAgotados', [md_autenticacion.Auth, verificarRol.administrador], facturaController.productosAgotados)
api.get('/obtenerFacturas/:idUsuario', [md_autenticacion.Auth, verificarRol.administrador], facturaController.obtenerFacturas)
api.get('/productosFactura/:idFactura', [md_autenticacion.Auth, verificarRol.administrador], facturaController.obtenerProductosFactura)
api.post('/productoAcarrito', [md_autenticacion.Auth, verificarRol.cliente], facturaController.carritoAfactura)



module.exports = api;


