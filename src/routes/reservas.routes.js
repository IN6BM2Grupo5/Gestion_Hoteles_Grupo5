const express = require('express');
const reservasController = require('../controllers/reservas.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/confirmarCuenta/:idUsuario?',md_autenticacion.Auth, reservasController.confirmarCuenta);
api.put('/reservar/:idHabitacion', md_autenticacion.Auth, reservasController.reservar);
api.put('/cancelarReserva/:descripcion/:idCuenta', md_autenticacion.Auth, reservasController.cancelarReserva);
api.get('/habitaciones',md_autenticacion.Auth, reservasController.verHabitacionesRegistrados);
api.get('/usuariosHotel',md_autenticacion.Auth, reservasController.verUsuariosRegistrados);
api.get('/usuariosHotelPorNombre',md_autenticacion.Auth, reservasController.verUsuariosRegistradosPorNombre);
api.get('/verHistorial',md_autenticacion.Auth, reservasController.verHistorial);
api.get('/verFacturas',md_autenticacion.Auth, reservasController.verFacturas);
api.get('/verReservas',md_autenticacion.Auth, reservasController.verRegistros);

module.exports = api;