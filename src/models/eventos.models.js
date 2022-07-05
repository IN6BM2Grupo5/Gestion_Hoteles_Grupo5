const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventosSchema = Schema({
    evento:String,
    tipo:String,
    imagen: String,
    idHotel: {type: Schema.Types.ObjectId, ref: 'hoteles'}
});

module.exports = mongoose.model('eventos', EventosSchema);