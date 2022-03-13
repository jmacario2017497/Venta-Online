const Usuario = require('../models/usuario.model')
const Producto = require('../models/producto.model')
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Factura = require('../models/factura.model')

function agregarUsuario(req, res) {
    var parametros = req.body;
    var usuarioModel = new Usuario();

    if (parametros.nombre && parametros.apellido && parametros.email && parametros.usuario && parametros.password && parametros.rol) {
        usuarioModel.nombre = parametros.nombre;
        usuarioModel.apellido = parametros.apellido;
        usuarioModel.email = parametros.email;
        usuarioModel.Usuario = parametros.usuario;
        usuarioModel.rol = parametros.rol;
        usuarioModel.totalCarrito = 0;

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
                            Factura.find({idUsuario: usuarioEncontrado._id}, (err, FacturasEncontradas)=>{
                                if(err) return res.status(500).send({mensaje: "error en la peticion"})
                                if(FacturasEncontradas.length == 0){
                                    return res.status(200).send({token: jwt.crearToken(usuarioEncontrado), facturas: "usted no tiene facturas aún"})
                                }else{
                                return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado), FacturasEncontradas })
                            }
                            })
                            
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

function agregarProductoCarrito(req, res) {
    const usuarioLogueado = req.user.sub;
    const parametros = req.body;

    Producto.findOne({ nombre: parametros.producto }, (err, productoEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "error en la peticion" })
        if (!productoEncontrado) return res.status(500).send({ mensaje: "error al obtener el producto" })
        if (parametros.cantidad > productoEncontrado.cantidad) {
            return res.status(500).send({ mensaja: "la cantidad a comprar supera al stock actual del prodcuto" })
        } else {
            Usuario.findOne({ _id: usuarioLogueado, carrito: { $elemMatch: { nombreProducto: parametros.producto } } }, (err, usuarioEncontrado) => {
                if (err) return res.status(500).send({ mensaje: "error en la peticion" })
                let cantidadLocal = 0;
                if (usuarioEncontrado) {
                    for (let i = 0; i < usuarioEncontrado.carrito.length; i++) {
                        //let cantidadSubTotalLocal = 0;
                        if (usuarioEncontrado.carrito[i].nombreProducto == parametros.producto) {
                            cantidadLocal = Number(usuarioEncontrado.carrito[i].cantidadComprada) + Number(parametros.cantidad)
                            Usuario.findOneAndUpdate({ carrito: { $elemMatch: { _id: usuarioEncontrado.carrito[i]._id } } }, { $inc: { "carrito.$.cantidadComprada": parametros.cantidad }, "carrito.$.subTotal": cantidadLocal * usuarioEncontrado.carrito[i].precioUnitario }, { new: true }, (err, carritoActualizado) => {
                                if (err) return res.status(200).send({ mensaje: "error al intentar actulizar carrito" })
                                if (!carritoActualizado) return res.status(500).send({ mensaje: "error al tratar de actulizar las cantidades" })

                                let carritoTotal = 0;

                                for (let i = 0; i < carritoActualizado.carrito.length; i++) {
                                    carritoTotal += carritoActualizado.carrito[i].subTotal

                                }

                                Usuario.findByIdAndUpdate(usuarioLogueado, { totalCarrito: carritoTotal }, { new: true }, (err, Actualizado) => {
                                    if (err) return res.status(500).send({ mensaje: "error en la peticion" })
                                    if (!Actualizado) return res.status(500).send({ mensaje: "error al intentar actualizar el carrito" })

                                    return res.status(200).send({ actualizado: Actualizado })
                                })
                            })

                        }

                    }
                } else {
                    Usuario.findByIdAndUpdate({ _id: usuarioLogueado }, { $push: { carrito: { nombreProducto: parametros.producto, cantidadComprada: parametros.cantidad, precioUnitario: productoEncontrado.precio, subTotal: Number(parametros.cantidad) * Number(productoEncontrado.precio) } } }, { new: true }, (err, usuarioActualizado) => {
                        if (err) return res.status(500).send({ mensaje: "error en la peticion" })
                        if (!usuarioActualizado) return res.status(500).send({ mensaje: "error al intentar actualizar el usuario" })

                        totalCarritoLocal = 0;

                        for (let i = 0; i < usuarioActualizado.carrito.length; i++) {
                            totalCarritoLocal += usuarioActualizado.carrito[i].subTotal
                            //totalCarritoLocal += totalCarrito + usuarioActualizado.carrito[i].precioUnitario
                        }

                        Usuario.findByIdAndUpdate({ _id: usuarioLogueado }, { totalCarrito: totalCarritoLocal }, { new: true }, (err, totalActualizado) => {
                            if (err) return res.status(500).send({ mensaje: "Error en la peticion de Total Carrito" });
                            if (!totalActualizado) return res.status(500).send({ mensaje: 'Error al modificar el total del carrito' });

                            return res.status(200).send({ usuario: totalActualizado })
                        })
                    })
                }

            })

        }


    })
}

function eliminarProductoCarrito(req, res) {
    const usuarioLogueado = req.user.sub;
    const parametros = req.body;

    if (parametros.cantidad) {
        Usuario.findOne({ _id: usuarioLogueado, carrito: { $elemMatch: { nombreProducto: parametros.producto } } }, (err, usuarioEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "error al obtener prducto" })
            let cantidadLocal = 0;
            if (usuarioEncontrado) {
                for (let i = 0; i < usuarioEncontrado.carrito.length; i++) {
                    //let cantidadSubTotalLocal = 0;
                    if (usuarioEncontrado.carrito[i].nombreProducto == parametros.producto) {
                        cantidadLocal = Number(usuarioEncontrado.carrito[i].cantidadComprada);
                        Usuario.findOneAndUpdate({ carrito: { $elemMatch: { _id: usuarioEncontrado.carrito[i]._id } } }, { $inc: { "carrito.$.cantidadComprada": parametros.cantidad }, "carrito.$.subTotal": (cantidadLocal - Math.abs(parametros.cantidad)) * (usuarioEncontrado.carrito[i].precioUnitario) }, { new: true }, (err, carritoActualizado) => {
                            if (err) return res.status(200).send({ mensaje: "error al intentar actulizar carrito" })
                            if (!carritoActualizado) return res.status(500).send({ mensaje: "error al tratar de actulizar las cantidades" })

                            let carritoTotal = 0;

                            

                            for (let i = 0; i < carritoActualizado.carrito.length; i++) {
                                if(carritoActualizado.carrito[i].cantidadComprada <= 0){
                                    Usuario.findByIdAndUpdate({ _id: usuarioLogueado }, { $pull: { carrito: { nombreProducto: parametros.producto } } }, { new: true }, (err, productoEliminado) => {
                                        if (err) return res.status(500).send({ mensaje: "error en la peticion" })
                                        if (!productoEliminado) return res.status(500).send({ mensaje: "el producto no se encuentra argregado a su carrito o no escribio correctamente el nombre del producto" })
                            
                                        totalCarritoLocal = 0;
                            
                                        for (let i = 0; i < productoEliminado.carrito.length; i++) {
                                            totalCarritoLocal = (totalCarritoLocal) - (-productoEliminado.carrito[i].subTotal)
                                            //totalCarritoLocal += totalCarrito + usuarioActualizado.carrito[i].precioUnitario
                                        }
                            
                                        Usuario.findByIdAndUpdate({ _id: usuarioLogueado }, { totalCarrito: totalCarritoLocal }, { new: true }, (err, totalActualizado) => {
                                            if (err) return res.status(500).send({ mensaje: "Error en la peticion de Total Carrito" });
                                            if (!totalActualizado) return res.status(500).send({ mensaje: 'Error al modificar el total del carrito' });
                            
                                            //return res.status(200).send({ usuario: totalActualizado })
                                        })
                            
                            
                                    })

                                }else{
                                    carritoTotal += carritoActualizado.carrito[i].subTotal
                                }
                                

                            }

                            Usuario.findByIdAndUpdate(usuarioLogueado, { totalCarrito: carritoTotal }, { new: true }, (err, Actualizado) => {
                                if (err) return res.status(500).send({ mensaje: "error en la peticion" })
                                if (!Actualizado) return res.status(500).send({ mensaje: "error al intentar actualizar el carrito" })

                                return res.status(200).send({ actualizado: Actualizado })
                            })
                        })

                    }

                }


            } else {
                return res.status(500).send({ mensaje: "no existe este producto en el carrito " })
            }
        })

    } else {
        Usuario.findByIdAndUpdate({ _id: usuarioLogueado }, { $pull: { carrito: { nombreProducto: parametros.producto } } }, { new: true }, (err, productoEliminado) => {
            if (err) return res.status(500).send({ mensaje: "error en la peticion" })
            if (!productoEliminado) return res.status(500).send({ mensaje: "el producto no se encuentra argregado a su carrito o no escribio correctamente el nombre del producto" })

            totalCarritoLocal = 0;

            for (let i = 0; i < productoEliminado.carrito.length; i++) {
                totalCarritoLocal = (totalCarritoLocal) - (-productoEliminado.carrito[i].subTotal)
                //totalCarritoLocal += totalCarrito + usuarioActualizado.carrito[i].precioUnitario
            }

            Usuario.findByIdAndUpdate({ _id: usuarioLogueado }, { totalCarrito: totalCarritoLocal }, { new: true }, (err, totalActualizado) => {
                if (err) return res.status(500).send({ mensaje: "Error en la peticion de Total Carrito" });
                if (!totalActualizado) return res.status(500).send({ mensaje: 'Error al modificar el total del carrito' });

                return res.status(200).send({ usuario: totalActualizado })
            })


        })

    }

}






module.exports = {
    agregarUsuario,
    registrarse,
    Login,
    editarUsuario,
    eliminarUsuario,
    agregarProductoCarrito,
    eliminarProductoCarrito
}