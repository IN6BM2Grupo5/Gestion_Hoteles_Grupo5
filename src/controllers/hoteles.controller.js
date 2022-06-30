const Hotel = require("../models/hoteles.models");
const Usuario = require("../models/usuarios.models");

//Agregar Hotel
function agregarHotel(req, res) {
    var parametros = req.body;
    var hotelModel = new Hotel();

    if (req.user.rol == 'Admin_APP') {
        if (parametros.nombreHotel && parametros.municipio && parametros.direccion && parametros.usuario) {
            Hotel.findOne({ nombreHotel: parametros.nombreHotel }, (err, hotelEncontrado) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                if (!hotelEncontrado) {
                    Hotel.findOne({ direccion: parametros.direccion }, (err, direccionIgual) => {
                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                        if (!direccionIgual) {
                            Usuario.findOne({ usuario: parametros.usuario }, (err, adminEncontrado) => {
                                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                if (!adminEncontrado) return res.status(500).send({ menssaje: "No se encontro ningun Administrador" });
                                Hotel.findOne({ idUsuario: adminEncontrado._id }, (err, adminAsignado) => {
                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                    if (!adminAsignado) {
                                        hotelModel.nombreHotel = parametros.nombreHotel;
                                        hotelModel.municipio = parametros.municipio;
                                        hotelModel.direccion = parametros.direccion;
                                        hotelModel.reservas = 0;
                                        hotelModel.idUsuario = adminEncontrado._id;
                                        hotelModel.save((err, hotelGuardado) => {
                                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                            if (!hotelGuardado) return res.status(500).send({ mensaje: 'Error al agregar el Hotel' });

                                            return res.status(200).send({ hotel: hotelGuardado })
                                        })
                                    } else {
                                        return res.status(500).send({ mensaje: 'Este usuario ya administra un hotel' });
                                    }
                                })
                            })
                        } else {
                            return res.status(500).send({ mensaje: 'Esta direccion ya se encuentra registrada' });
                        }
                    })
                } else {
                    return res.status(500).send({ mensaje: 'Este hotel ya existe' });
                }
            })
        } else {
            return res.status(500).send({ mensaje: 'Ingrese todos los parametros' })
        }
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

//Editar Hotel
function editarHotel(req, res) {
    var parametros = req.body;
    var idHotel = req.params.idHotel;
    if (req.user.rol == 'Admin_APP') {
        if (parametros.reservas) return res.status(500).send({ mensaje: 'No se puede editar el parametro de reservas' });
        Hotel.findById(idHotel, (err, infoHotel) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            Hotel.findOne({ nombreHotel: parametros.nombreHotel }, (err, hotelEncontrado) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                Hotel.findOne({ direccion: parametros.direccion }, (err, direccionEncontrada) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                    if (!hotelEncontrado || parametros.nombreHotel == infoHotel.nombreHotel) {
                        if (!direccionEncontrada || parametros.direccion == infoHotel.direccion) {
                            Hotel.findByIdAndUpdate(infoHotel, parametros, { new: true }, (err, hotelActualizado) => {
                                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                if (!hotelActualizado) return res.status(500).send({ mensaje: 'Error al editar el hotel' });

                                return res.status(200).send({ hotel: hotelActualizado });
                            })
                        } else {
                            return res.status(500).send({ mensaje: 'Esta direccion ya se encuentra registrada' })
                        }
                    } else {
                        return res.status(500).send({ mensaje: 'Este hotel ya existe' });
                    }
                })
            })
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

//Eliminar Hotel
function eliminarHotel(req, res) {
    var idHotel = req.params.idHotel;
    if (req.user.rol == 'Admin_APP') {
        Hotel.findByIdAndDelete(idHotel, (err, hotelEliminado) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!hotelEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el hotel' });

            return res.status(200).send({ hotel: hotelEliminado });
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' })
    }
}

//traer hoteles
function encontrarHoteles(req, res) {
    if (req.user.rol == 'Admin_APP' || req.user.rol == 'Cliente') {
        Hotel.find((err, hotelesEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la pticion' });
            if (!hotelesEncontrados) return res.status(500).send({ mensaje: 'Error al encontrar los hoteles' });

            return res.status(200).send({ hoteles: hotelesEncontrados });
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

function econtrarHotelId(req, res) {
    var idHotel = req.params.idHotel;
    Hotel.findById(idHotel, (err, hotelEncontrado) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
        if (!hotelEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar el hotel' });

        return res.status(200).send({ hotel: hotelEncontrado });
    })
}

function buscarHotelPorNombre(req, res) {
    var nombre = req.params.nombre;
    if (req.user.rol == 'Admin_APP' || req.user.rol == 'Cliente') {
        Hotel.find({ nombreHotel: { $regex: nombre, $options: 'i' } }, (err, hotelesEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!hotelesEncontrados) return res.status(500).send({ mensaje: 'Error al encontrar los hoteles encontrados' });

            return res.status(200).send({ hoteles: hotelesEncontrados });
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

function buscarPorAdmin(req, res) {
    var idAdmin;
    if (req.user.rol == 'Admin_APP') {
        idAdmin = req.params.idAdmin;
    } else if (req.user.rol == 'Admin_Hotel') {
        idAdmin = req.user.sub;
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }

    Hotel.findOne({ idUsuario: idAdmin }, (err, hotelEncontrado) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion'});
        if(!hotelEncontrado) return res.status(500).send({mensaje:'Error al encontrar el hotel'});

        return res.status(200).send({hotel: hotelEncontrado});
    })
}

//Exports
module.exports = {
    agregarHotel,
    editarHotel,
    eliminarHotel,
    encontrarHoteles,
    econtrarHotelId,
    buscarHotelPorNombre,
    buscarPorAdmin
}