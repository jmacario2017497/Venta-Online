const mongoose = require('mongoose');
const app = require('./app');
const Usuarios = require('./src/models/usuario.model')
const bcrypt = require('bcrypt-nodejs');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Venta-Online', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {

    app.listen(3000, function () {
        console.log("La base de datos esta corriendo en el puerto 3000!");
        Usuarios.find({ Usuario: 'ADMIN' }, (err, usuarioEcontrado) => {
            if (usuarioEcontrado == 0) {

                bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                    Usuarios.create({
                        nombre: 'Renato',
                        apellido: 'Vargas',
                        email: 'rvargas@gmail.com',
                        Usuario: 'ADMIN',
                        password: passwordEncriptada,
                        rol: 'Administrador'
                    })

                });
            } else {

            }

        })
    })


}).catch(error => console.log(error))