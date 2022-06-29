const express = require('express');
const cors = require('cors');
var app = express();

const UsuarioRutas = require('./src/routes/usuarios.routes');
const HotelesRutas = require('./src/routes/hoteles.routes');
const HabitacionesRutas = require('./src/routes/habitaciones.routes');
const HotelesRutas = require('./src/routes/hoteles.routes');
const EventosRutas = require('./src/routes/eventos.routes');


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/api', UsuarioRutas,HotelesRutas,HabitacionesRutas,EventosRutas);


module.exports = app;