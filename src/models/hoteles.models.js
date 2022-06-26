const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HotelesSchema = Schema({
    nombreHotel:String,
    municipio: String,
    direccion:String,
    idUsuario: {type: Schema.Types.ObjectId, ref: 'usuarios'},
    reservas: Number 
});

module.exports = mongoose.model('hoteles', HotelesSchema);