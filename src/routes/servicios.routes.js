const express = require('express');
const serviciosController = require('../controllers/servicios.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/agregarServicio/:idHotel',md_autenticacion.Auth, serviciosController.agregarServicio);
api.put('/editarServicio/:idServicio', md_autenticacion.Auth, serviciosController.editarServicio);
api.put('/pedirServicio/:idServicio', md_autenticacion.Auth, serviciosController.pedirServicio);
api.delete('/eliminarServicio/:idServicio', md_autenticacion.Auth, serviciosController.eliminarServicio);
api.get('/servicioId/:idServicio',md_autenticacion.Auth, serviciosController.verServiciosId)
api.get('/servicios/:idHotel?',md_autenticacion.Auth, serviciosController.verServicios);
module.exports = api;