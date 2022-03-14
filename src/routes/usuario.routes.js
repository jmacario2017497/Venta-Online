const express = require('express');
const usuarioController = require('../controllers/usuario.controller')
const md_autenticacion = require('../middlewares/autenticacion')
const verificarRol = require('../middlewares/rol')

const api = express.Router();

api.post('/agregarUsuario', [md_autenticacion.Auth, verificarRol.administrador], usuarioController.agregarUsuario);
api.post('/registrar', usuarioController.registrarse);
api.post('/login', usuarioController.Login);
api.put('/editarusuario/:idUsuario', md_autenticacion.Auth, usuarioController.editarUsuario)
api.get('/buscarUsuario/:idUsuario', [md_autenticacion.Auth, verificarRol.administrador], usuarioController.buscarUsuarios)
api.delete('/eliminarUsuario/:idUsuario', md_autenticacion.Auth, usuarioController.eliminarUsuario)
api.put('/agregarProductoCarrito', [md_autenticacion.Auth, verificarRol.cliente], usuarioController.agregarProductoCarrito)
api.put('/eliminarProductoCarrito', [md_autenticacion.Auth, verificarRol.cliente], usuarioController.eliminarProductoCarrito)



module.exports = api;
