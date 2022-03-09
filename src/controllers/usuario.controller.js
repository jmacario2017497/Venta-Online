const Usuario = require('../models/usuario.model')
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function agregarUsuario(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuario();

    if (parametros.nombre && parametros.apellido && parametros.email && parametros.usuario && parametros.password && parametros.rol) {
        usuarioModel.nombre = parametros.nombre;
        usuarioModel.apellido = parametros.apellido;
        usuarioModel.email = parametros.email;
        usuarioModel.Usuario = parametros.usuario;
        usuarioModel.rol = parametros.rol;

        Usuario.find({ Usuario: parametros.usuario }, (err, usuarioEncontrado) => {
            if (usuarioEncontrado.length == 0) {

                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    usuarioModel.password = passwordEncriptada;

                    usuarioModel.save((err, usuarioGuardado) => {
                        if (err) return res.status(500)
                            .send({ mensaje: 'Error en la peticion' });
                        if (!usuarioGuardado) return res.status(500)
                            .send({ mensaje: 'Error al agregar el usuario' });

                        return res.status(200).send({ usuario: usuarioGuardado });
                    });
                });
            } else {
                return res.status(500)
                    .send({ mensaje: 'este usuario ya se encuentra registrado' });
            }
        })
    } else {
        return res.status(500).send({ mensaje: "debe llenar todos los campos necesarios" })
    }
}

function registrarse(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuario();

    if (parametros.nombre && parametros.apellido && parametros.email && parametros.usuario && parametros.password) {
        usuarioModel.nombre = parametros.nombre;
        usuarioModel.apellido = parametros.apellido;
        usuarioModel.email = parametros.email;
        usuarioModel.Usuario = parametros.usuario;
        usuarioModel.rol = "Cliente";

        Usuario.find({ Usuario: parametros.usuario }, (err, usuarioEncontrado) => {
            if (usuarioEncontrado.length == 0) {

                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    usuarioModel.password = passwordEncriptada;

                    usuarioModel.save((err, usuarioGuardado) => {
                        if (err) return res.status(500)
                            .send({ mensaje: 'Error en la peticion' });
                        if (!usuarioGuardado) return res.status(500)
                            .send({ mensaje: 'Error al agregar el usuario' });

                        return res.status(200).send({ usuario: usuarioGuardado });
                    });
                });
            } else {
                return res.status(500)
                    .send({ mensaje: 'este usuario ya se encuentra registrado' });
            }
        })
    } else {
        return res.status(500).send({ mensaje: "debe llenar todos los campos necesarios" })
    }
}

function Login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ Usuario: parametros.Usuario }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (usuarioEncontrado) {
            bcrypt.compare(parametros.password, usuarioEncontrado.password,
                (err, verificacionPassword) => {
                    if (verificacionPassword) {
                        if (parametros.obtenerToken === 'true') {
                            return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return res.status(200)
                                .send({ usuario: usuarioEncontrado })
                        }


                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contrasena no coincide' });
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: 'el usuario no se encuentran registrados' })
        }
    })
}

function editarUsuario(req, res) {
    var idUser = req.params.idUsuario
    var parametros = req.body;

    if (req.user.rol !== "Administrador") {
        if (idUser != req.user.sub) {
            return res.status(500).send({ mensaje: "no puede editar otros usuarios" })
        } else {
            if (parametros.rol) {
                return res.status(500).send({ mensaje: "no puedo modificar su rol" })
            } else {
                Usuario.findByIdAndUpdate(req.user.sub, parametros, { new: true }, (err, usuarioActualizado) => {
                    if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
                    if (!usuarioActualizado) return res.status(500).send({ mensaje: 'error al editar el usuario' })
                    return res.status(200).send({ usuario: usuarioActualizado })
                })
            }
        }

    } else {

        Usuario.findById(idUser, (err, usuarioEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "error en la peticion" })
            if (!usuarioEncontrado) return res.status(500).send({ mensaje: "no se encontro el usuario que quiero modificar" })

            if (usuarioEncontrado.rol !== "Administrador") {
                Usuario.findByIdAndUpdate(idUser, parametros, { new: true }, (err, usuarioActualizado1) => {
                    if (err) return res.status(500).send({ mensaje: "error en la peticion" })
                    if (!usuarioActualizado1) return res.status(500).send({ mensaje: "error al intentar actualizar el usuario" })

                    return res.status(200).send({ usuario: usuarioActualizado1 })
                })
            } else {
                if (idUser == req.user.sub) {
                    if (parametros.rol) {
                        return res.status(500).send({ mensaje: "no puedo modificar su rol" })
                    } else {
                        Usuario.findByIdAndUpdate(req.user.sub, parametros, { new: true }, (err, usuarioActualizado) => {
                            if (err) return res.status(500).send({ mensaje: 'error en la peticion' })
                            if (!usuarioActualizado) return res.status(500).send({ mensaje: 'error al editar el usuario' })
                            return res.status(200).send({ usuario: usuarioActualizado })
                        })
                    }

                } else {
                    return res.status(500).send({ mensaje: "no puede editar un usuario con rol administrador" })
                }
            }
        })

    }
}

function eliminarUsuario(req, res) {
    var idUser = req.params.idUsuario;

    if (req.user.rol !== "Administrador") {
        if (req.user.sub != idUser) {
            return res.status(500).send({ mensaje: "no puede eliminar a otros usuarios" })
        } else {
            Usuario.findByIdAndDelete(req.user.sub, (err, usuarioEliminado) => {
                if (err) return res.status(500).send({ mensaje: "error en la peticion" })
                if (!usuarioEliminado) return res.status(500).send({ mensaje: "cielos! a ocurrido un error al intentar eliminar la cuenta" })

                return res.status(200).send({ usuario: usuarioEliminado })
            })
        }
    } else {
        Usuario.findById(idUser, (err, usuarioEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "error en la peticion" })
            if (!usuarioEncontrado) return res.status(500).send({ mensaje: "no se encontro el usuario que quiero modificar" })

            if (usuarioEncontrado.rol !== "Administrador") {
                Usuario.findByIdAndDelete(idUser, (err, usuarioEliminado) => {
                    if (err) return res.status(500).send({ mensaje: "error en la peticion" })
                    if (!usuarioEliminado) return res.status(500).send({ mensaje: "error al intentar eliminar el usuario" })

                    return res.status(200).send({ usuario: usuarioEliminado })
                })
            } else {
                if (idUser == req.user.sub) {
                    Usuario.findByIdAndDelete(idUser, (err, usuarioEliminado1) => {
                        if (err) return res.status(500).send({ mensaje: "error en la peticion" })
                        if (!usuarioEliminado1) return res.status(500).send({ mensaje: "error al intentar eliminar el usuario" })
            
                        return res.status(200).send({ usuario: usuarioEliminado1 })
                    })


                } else {
                    return res.status(500).send({ mensaje: "no puede eliminar a otros administradores" })
                }
            }
        })

    }

}



module.exports = {
    agregarUsuario,
    registrarse,
    Login,
    editarUsuario,
    eliminarUsuario
}