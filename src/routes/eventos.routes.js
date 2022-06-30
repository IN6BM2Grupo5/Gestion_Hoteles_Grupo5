const express = require('express');
const eventoController = require('../controllers/eventos.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/agregarEvento/:idHotel',md_autenticacion.Auth, eventoController.agregarEvento);
api.put('/editarEvento/:idEvento', md_autenticacion.Auth, eventoController.editarEvento);
api.delete('/eliminarEvento/:idEvento', md_autenticacion.Auth, eventoController.eliminarEventos);
api.get('/eventoId/:idEvento',md_autenticacion.Auth, eventoController.verEventoPorId)
api.get('/eventos/:idHotel?',md_autenticacion.Auth, eventoController.verEventos);
module.exports = api;