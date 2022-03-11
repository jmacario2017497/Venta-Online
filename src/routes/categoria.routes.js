const express = require('express');
const categoriaController = require('../controllers/categoria.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const verificarRol = require('../middlewares/rol')

const api = express.Router();

api.post('/agregarCategoria', [md_autenticacion.Auth, verificarRol.administrador], categoriaController.agregarCategoria);
api.get('/visualizarCategorias', md_autenticacion.Auth, categoriaController.obtenerCategorias);
api.get('/productosCategoria', [md_autenticacion.Auth, verificarRol.cliente], categoriaController.buscarCategoriaNombre)
api.put('/editarCategoria/:idCategoria', [md_autenticacion.Auth, verificarRol.administrador], categoriaController.editarCategoria)
api.delete('/eliminarCategoria/:idCategoria',[md_autenticacion.Auth, verificarRol.administrador], categoriaController.eliminarCategoria)

module.exports = api;