const mongoose = require('mongoose');
const app = require('./app');
const usuarioController = require('./src/controllers/usuarios.controller');

mongoose.Promise = global.Promise;                                                              
mongoose.connect('mongodb://localhost:27017/GRUPO5_HOTELES', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Se encuentra conectado a la base de datos.");

    app.listen(3000, function () {
        console.log("Hoteles, esta corriendo en el puerto 3000!")
    })

}).catch(error => console.log(error));

usuarioController.AdminApp();