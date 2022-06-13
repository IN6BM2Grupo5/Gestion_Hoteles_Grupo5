const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FacturasSchema = Schema({
    idUsuario: {type: Schema.Types.ObjectId, ref: 'usuarios'},
    total:Number,
    cuenta: [{
        descripcion: String,
        precio:Number
    }]
});

module.exports = mongoose.model('facturas', FacturasSchema);