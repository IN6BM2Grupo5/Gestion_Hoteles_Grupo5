const express = require('express');
const habitacionController = require('../controllers/habitaciones.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/agregarHabitacion/:idHotel',md_autenticacion.Auth, habitacionController.agregarHabitaciones);
api.put('/editarHabitacion/:idHabitacion', md_autenticacion.Auth, habitacionController.editarHabitaciones);
api.delete('/eliminarHabitacion/:idHabitacion', md_autenticacion.Auth, habitacionController.eliminarHabitaciones);
api.get('/habitacionId/:idHabitacion',md_autenticacion.Auth, habitacionController.verHabitacionPorId)
api.get('/habitaciones/:idHotel?',md_autenticacion.Auth, habitacionController.verHabitaciones);
module.exports = api;