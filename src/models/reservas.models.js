const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservasSchema = Schema({
    numeroCuarto:String,
    fechaInicio:Date,
    fechaFin:Date,
    dias: Number,
    idUsuario: {type: Schema.Types.ObjectId, ref: 'usuarios'},
    idHotel: {type: Schema.Types.ObjectId, ref: 'hoteles'}
});

module.exports = mongoose.model('reservas', ReservasSchema);