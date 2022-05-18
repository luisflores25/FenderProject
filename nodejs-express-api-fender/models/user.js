'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    _id: String,
    email: String,
    usuario: String,
    password: String
});

module.exports = mongoose.model('Usuarios', UsuarioSchema);
// user --> guarda documentos de este tipo y con estructura dentro de la coleccion
