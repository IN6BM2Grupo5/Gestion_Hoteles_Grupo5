const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservasSchema = Schema({
    fechaInicio:Date,
    fechaFin:Date,
    idUsuario: {type: Schema.Types.ObjectId, ref: 'usuarios'},
    idHotel:{type: Schema.Types.ObjectId, ref: 'hoteles'},
});

module.exports = mongoose.model('reservas', ReservasSchema);