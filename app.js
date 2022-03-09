const express = require('express');
const cors = require('cors');
var app = express();

const rutasUsuarios = require('./src/routes/usuario.routes')
//const rutasEmpleados = require('./src/routes/empleados.routes')

app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(cors());

app.use('/api', rutasUsuarios);

module.exports = app;