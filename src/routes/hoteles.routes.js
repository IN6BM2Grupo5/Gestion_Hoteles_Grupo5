const express = require('express');
const hotelController = require('../controllers/hoteles.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/agregarHotel',md_autenticacion.Auth, hotelController.agregarHotel);
api.put('/editarHotel/:idHotel', md_autenticacion.Auth, hotelController.editarHotel);
api.delete('/eliminarHotel/:idHotel', md_autenticacion.Auth, hotelController.eliminarHotel);
api.get('/hotelId/:idHotel',md_autenticacion.Auth, hotelController.econtrarHotelId)
api.get('/hoteles',md_autenticacion.Auth, hotelController.encontrarHoteles);
api.get('/hotelesPorNombre/:nombre',md_autenticacion.Auth, hotelController.buscarHotelPorNombre);
api.get('/hotelesPorAdmin/:idAdmin?',md_autenticacion.Auth, hotelController.buscarPorAdmin);
module.exports = api;