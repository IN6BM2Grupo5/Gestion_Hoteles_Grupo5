const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HotelesSchema = Schema({
    nombreHotel:String,
    pais: String,
    direccion: String,
    cuartos:[{
        numero:String,
        estado:Boolean,
        precio:Number
    }],
    idUsuario: {type: Schema.Types.ObjectId, ref: 'usuarios'} 
});

module.exports = mongoose.model('hoteles', HotelesSchema);