const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuariosSchema = Schema({
    nombre: String,
    usuario: String,
    password: String,
    rol: String,
    idHotel:{type: Schema.Types.ObjectId, ref: 'hoteles'},
    cuenta: [{
        descripcion: String,
        precio:Number,
        fechaInicio:Date,
        fechaFin:Date,
        habitacion: String,
        hotel:String,
        idHabitacion:{type: Schema.Types.ObjectId, ref: 'habitaciones'}
    }],
    total:Number
});

module.exports = mongoose.model('usuarios', UsuariosSchema);