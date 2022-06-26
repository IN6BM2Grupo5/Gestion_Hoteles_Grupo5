const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HabitacinesSchema = Schema({
    tipo: String,
    estado: String,
    registros:Number,
    precio: Number,
    idHotel: {type: Schema.Types.ObjectId, ref: 'hoteles'},
});

module.exports = mongoose.model('habitaciones', HabitacinesSchema);