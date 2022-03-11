const express = require('express');
const cors = require('cors');
var app = express();

const rutasUsuarios = require('./src/routes/usuario.routes')
const rutasCategorias = require('./src/routes/categoria.routes')
const rutasProductos = require('./src/routes/producto.routes')
const rutasFacturas = require('./src/routes/factura.routes')

app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(cors());

app.use('/api', rutasUsuarios, rutasCategorias, rutasProductos, rutasFacturas);

module.exports = app;