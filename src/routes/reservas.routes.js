const express = require('express');
const reservasController = require('../controllers/reservas.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.put('/reservar/:idHabitacion', md_autenticacion.Auth, reservasController.reservar);
api.get('/habitaciones',md_autenticacion.Auth, reservasController.verHabitacionesRegistrados);
api.get('/usuariosHotel',md_autenticacion.Auth, reservasController.verUsuariosRegistrados);

module.exports = api;