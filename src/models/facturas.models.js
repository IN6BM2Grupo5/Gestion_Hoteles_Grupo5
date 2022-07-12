const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FacturasSchema = Schema({
    idUsuario: {type: Schema.Types.ObjectId, ref: 'usuarios'},
    cuenta: [{
        descripcion: String,
        precio:Number,
        fechaInicio:Date,
        hotel:String,
        habitacion: String,
        fechaFin:Date,
        idHabitacion:{type: Schema.Types.ObjectId, ref: 'habitaciones'}
    }],
    total:Number
});

module.exports = mongoose.model('facturas', FacturasSchema);