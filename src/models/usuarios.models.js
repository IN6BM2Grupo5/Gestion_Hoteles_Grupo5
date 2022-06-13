const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuariosSchema = Schema({
    nombre: String,
    usuario: String,
    password: String,
    rol: String,
    cuenta: [{
        descripcion: String,
        precio:Number
    }]
});

module.exports = mongoose.model('usuarios', UsuariosSchema);