const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiciosSchema = Schema({
    servicio:String,
    precio:Number,
    idHotel: {type: Schema.Types.ObjectId, ref: 'hoteles'}
});

module.exports = mongoose.model('servicios', ServiciosSchema);