const express = require('express');
const categoriaController = require('../controllers/categoria.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const verificarRol = require('../middlewares/rol')

const api = express.Router();

api.post('/agregarCategoria', [md_autenticacion.Auth, verificarRol.administrador], categoriaController.agregarCategoria);
api.get('/obtenerCategorias', [md_autenticacion.Auth, verificarRol.administrador], categoriaController.obtenerCategorias);
api.put('/editarCategoria/:idCategoria', [md_autenticacion.Auth, verificarRol.administrador], categoriaController.editarCategoria)

