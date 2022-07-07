const Servicio = require("../models/servicios.models");
const Hotel = require("../models/hoteles.models");
const Habitacion = require("../models/habitaciones.models");
const Usuario = require("../models/usuarios.models");
const Reserva = require("../models/reservas.models");

//Agregar
function agregarServicio(req, res) {
    var parametros = req.body;
    var servicioModel = new Servicio();
    var idHotel = req.params.idHotel;
    if (req.user.rol == "Admin_APP") {
        if (parametros.servicio && parametros.precio) {
            if (parametros.precio >= 0) {
                Servicio.findOne({ servicio: parametros.servicio, idHotel: idHotel }, (err, servicioExistente) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                    if (!servicioExistente) {
                        servicioModel.servicio = parametros.servicio;
                        servicioModel.precio = parametros.precio;
                        servicioModel.idHotel = idHotel;
                        servicioModel.save((err, servicioGuardado) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!servicioGuardado) return res.status(500).send({ mensaje: 'Error al guardar el hotel' });

                            return res.status(200).send({ servicio: servicioGuardado })
                        });
                    } else {
                        return res.status(500).send({ mensaje: 'Este servicio ya se ha registrado' })
                    }
                });
            } else {
                return res.status(500).send({ mensaje: 'Ingrese un precio razonable' });
            }
        } else {
            return res.status(500).send({ mensaje: 'Ingrese los campos necesarios' });
        }
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

//Editar
function editarServicio(req, res) {
    var parametros = req.body;
    var idServicio = req.params.idServicio;
    if (req.user.rol == 'Admin_APP') {
        if (parametros.idHotel) return res.status(500).send({ mensaje: 'Estos campos no se pueden ingresar' });
        if (parametros.precio >= 0) {
            Servicio.findById(idServicio, (err, infoServicio) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                if (!infoServicio) return res.status(500).send({ mensaje: 'Error al traer la informacion del servicio' });
                Servicio.findOne({ servicio: parametros.servicio, idHotel: infoServicio.idHotel }, (err, servicioEncontrado) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                    if (!servicioEncontrado || infoServicio.servicio == parametros.servicio) {
                        Servicio.findByIdAndUpdate(idServicio, parametros, { new: true }, (err, servicioActualizado) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!servicioActualizado) return res.status(500).send({ mensaje: 'Error al actualizar la habitacion' });

                            return res.status(200).send({ servicio: servicioActualizado });
                        })
                    } else {
                        return res.status(500).send({ mensaje: 'Este Servicio ya se ha registrado' });
                    }
                });
            });
        } else {
            return res.status(500).send({ mensaje: 'Ingrese un precio razonable' });
        }
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

//Eliminar
function eliminarServicio(req, res) {
    var idServicio = req.params.idServicio;
    if (req.user.rol == "Admin_APP") {
        Servicio.findByIdAndDelete(idServicio, (err, servicioEliminado) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!servicioEliminado) return res.status(500).send({ mensaje: 'Error al eliminar la habitacion' });

            return res.status(200).send({ servicio: servicioEliminado });
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' })
    }
}

//Buscar
function verServicios(req, res) {
    let idHotel;
    if (req.user.rol == 'Admin_APP' || req.user.rol == 'Cliente') {
        idHotel = req.params.idHotel;
        Servicio.find({ idHotel: idHotel }, (err, serviciosEncontrados) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!serviciosEncontrados) return res.status(500).send({ mensaje: 'Error al encontrar las habitaciones encontradas' });

            return res.status(200).send({ servicios: serviciosEncontrados });
        })
    } else if (req.user.rol == 'Admin_Hotel') {
        Hotel.findOne({ idUsuario: req.user.sub }, (err, hotelEncontrado) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!hotelEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar el hotel en la peticion' });
            idHotel = hotelEncontrado._id;
            Servicio.find({ idHotel: idHotel }, (err, serviciosEncontrados) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                if (!serviciosEncontrados) return res.status(500).send({ mensaje: 'Error al encontrar las habitaciones encontradas' });

                return res.status(200).send({ servicios: serviciosEncontrados });
            })
        });
    }
}

function verServiciosId(req, res) {
    var idServicio = req.params.idServicio;
    if (req.user.rol == "Admin_APP") {
        Servicio.findById(idServicio, (err, servicioEncontrado) => {
            if (err) return res.status(404).send({ mensaje: 'No esta autorizado' });
            if (!servicioEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar la habitacion' });

            return res.status(200).send({ servicio: servicioEncontrado });
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}
//Pedir Servicios
function pedirServicio(req, res) {
    var idServicio = req.params.idServicio;
    var parametros = req.body;
    if (req.user.rol == 'Cliente') {
        if (parametros.habitacion && parametros.fechaInicio) {
            Reserva.findOne({ idHabitacion: parametros.idHabitacion }, (err, reservaEncontrada) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                if (!reservaEncontrada) return res.status(500).send({ mensaje: 'Error al encontrar la reserva' });
                var d1 = new Date(parametros.fechaInicio).getTime();
                if (d1 <= reservaEncontrada.fechaFin.get(time) && d1 >= reservaEncontrada.fechaInicio.get(time)) {
                    Servicio.findById(idServicio, (err, servicioEncontrado) => {
                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                        if (!servicioEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar el servicio' });
                        Usuario.findByIdAndUpdate(req.user.sub, {
                            $push: {
                                cuenta: {
                                    descripcion: servicioEncontrado.servicio,
                                    fechaInicio: parametros.fechaInicio,
                                    fechaFin: null,
                                    precio: servicioEncontrado.precio, idHabitacion: parametros.idHabitacion
                                }
                            }
                        }, { new: true }, (err, cuentaActualizada) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!cuentaActualizada) return res.status(500).send({ mensaje: 'Error al actualizar la cuenta' });
                            for (let i = 0; i < cuentaActualizada.cuenta.length; i++) {
                                totalCuenta += cuentaActualizada.cuenta[i].precio;
                            }
                            Usuario.findByIdAndUpdate(req.user.sub, { total: totalCuenta }, { new: true },
                                (err, totalActualizado) => {
                                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                                    if (!totalActualizado) return res.status(500).send({ mensaje: 'Error al modificar el total de la cuenta' });
                                    return res.status(200).send({ cuenta: totalActualizado.cuenta });
                                });
                        });
                    });
                } else {
                    return res.status(500).send({ mensaje: 'La fecha no concuerda con la reservacion de la habitacion' });
                }
            });
        }
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

//Exports
module.exports = {
    agregarServicio,
    editarServicio,
    eliminarServicio,
    verServicios,
    verServiciosId,
    pedirServicio
}