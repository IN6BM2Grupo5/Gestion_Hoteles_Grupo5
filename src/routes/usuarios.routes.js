const express = require('express');
const usuarioController = require('../controllers/usuarios.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/registrar', usuarioController.Registrar);
api.post('/agregarEmpresa',md_autenticacion.Auth, usuarioController.Registrar);
api.post('/login', usuarioController.Login);
api.put('/editarUsuario/:idUsuario?', md_autenticacion.Auth, usuarioController.EditarUsuario);
api.delete('/eliminarUsuario/:idUsuario?', md_autenticacion.Auth, usuarioController.EliminarUsuario);
api.get('/usuarioId/:idUsuario',md_autenticacion.Auth, usuarioController.encontrarUsuarioId)
api.get('/usuarios',md_autenticacion.Auth, usuarioController.encontrarUsuarios);
api.get('/Admins',md_autenticacion.Auth, usuarioController.encontrarAdminHotel);
api.get('/usuariosPorNombre/:nombre',md_autenticacion.Auth, usuarioController.buscarusuariosPorNombre);
module.exports = api;