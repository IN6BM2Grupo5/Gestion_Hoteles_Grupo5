const Hotel = require("../models/hoteles.models");
const Habitacion = require("../models/habitaciones.models");
const Usuario = require("../models/usuarios.models");
const Reserva = require("../models/reservas.models");

//Hacer reserva
function reservar(req, res) {
    var idHabitacion = req.params.idHabitacion;
    var reservaModel = new Reserva();
    var parametros = req.body;
    var dias = 0;
    var total = 0;
    var totalCuenta = 0;
    if (req.user.rol == 'Cliente') {
        if (parametros.fechaInicio && parametros.fechaFin) {
            Habitacion.findById(idHabitacion, (err, infoHabitacion) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                if (!infoHabitacion) return res.status(500).send({ mensaje: 'Error al encontrar la habitacion' });
                if (infoHabitacion.estado == 'Disponible') {
                    Reserva.find({ idUsuario: req.user.sub }, (err, usuarioEncontrado) => {
                        Reserva.find({ idHotel: infoHabitacion.idHotel, idUsuario: req.user.sub }, (err, hospedado) => {
                            if (usuarioEncontrado.length == 0 || hospedado.length != 0) {
                                var d1 = new Date(parametros.fechaInicio).getTime();
                                var d2 = new Date(parametros.fechaFin).getTime();
                                if (d2 > d1) {
                                    dias = ((d2 - d1) / (1000 * 60 * 60 * 24)) + 1;
                                    total = Number(infoHabitacion.precio) * dias;
                                    Usuario.findByIdAndUpdate(req.user.sub, {
                                        $push: {
                                            cuenta: {
                                                descripcion: infoHabitacion.tipo,
                                                fechaInicio: parametros.fechaInicio,
                                                fechaFin: parametros.fechaFin,
                                                precio: infoHabitacion.precio, idHabitacion: idHabitacion
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
                                                Habitacion.findByIdAndUpdate(idHabitacion, { estado: 'Reservado', $inc: { registros: 1 } }, { new: true }, (err, habitacionActualizada) => {
                                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                    if (!habitacionActualizada) return res.status(500).send({ mensaje: 'Error al editar la habitacion' });
                                                    Hotel.findByIdAndUpdate(infoHabitacion.idHotel, { $inc: { reservas: 1 } }, { new: true }, (err, hotelActualizado) => {
                                                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                        if (!hotelActualizado) return res.status(500).send({ mensaje: 'Error al actualizar el hotel' });
                                                        reservaModel.fechaInicio = parametros.fechaInicio;
                                                        reservaModel.fechaFin = parametros.fechaFin;
                                                        reservaModel.idUsuario = req.user.sub;
                                                        reservaModel.idHotel = infoHabitacion.idHotel;
                                                        reservaModel.idHabitacion = idHabitacion;
                                                        reservaModel.save((err, reservaGuardada) => {
                                                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                            if (!reservaGuardada) return res.status(500).send({ mensaje: 'Error al guardar la reserva' });
                                                            return res.status(200).send({ reserva: reservaGuardada });
                                                        });
                                                    })
                                                });
                                            });
                                    });
                                } else {
                                    return res.status(500).send({ mensaje: 'Agendo mal las fechas' });
                                }
                            } else {
                                return res.status(500).send({ mensaje: 'Usted ya esta registrado en otro hotel' })
                            }
                        })
                    });
                } else {
                    return res.status(500).send({ mensaje: 'Esta habitacion no se encuentra disponible' })
                }
            });
        } else {
            return res.status(500).send({ mensaje: 'Rellene todos los campos' });
        }
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

//Cancelar de la cuenta
function cancelarReserva(req, res) {
    var idCuenta = req.params.idCuenta;
    var totalCuenta = 0;
    if (req.user.rol == 'Cliente') {
        Usuario.findOne({ cuenta: { $elemMatch: { _id: idCuenta } } },
            (err, infoCuenta) => {
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                if (!infoCuenta) return res.status(500).send({ mensaje: "Error al encontrar el elemento" });
                Habitacion.findOne({ tipo: infoCuenta.descripcion }, (err, habitacionEncontrada) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                    if (habitacionEncontrada) {
                        Reserva.findOneAndDelete({ idHabitacion: infoCuenta.idHabitacion, idUsuario: req.user.sub }, (err, reservaEliminada) => {
                            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                            if (!reservaEliminada) return res.status(500).send({ mensaje: 'Error al eliminar la reserva' });
                            Habitacion.findByIdAndUpdate(habitacionEncontrada._id, { estado: 'Disponible', $inc: { registros: -1 } }, { new: true }, (err, habitacionActualizada) => {
                                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                if (!habitacionActualizada) return res.status(500).send({ mensaje: 'Error al editar la habitacion' });
                                Hotel.findByIdAndUpdate(habitacionEncontrada.idHotel, { $inc: { reservas: -1 } }, { new: true }, (err, hotelActualizado) => {
                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                    if (!hotelActualizado) return res.status(500).send({ mensaje: 'Error al actualizar el hotel' });
                                    Reserva.find({ idHabitacion: infoCuenta.idHabitacion, idUsuario: req.user.sub }, (err, reservasExistentes) => {
                                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                        if (reservasExistentes.length != 0) {
                                            Usuario.findOneAndUpdate({ cuenta: { $elemMatch: { _id: idCuenta } } }, {$pull:{cuenta:{_id:idCuenta}}}, {new: true},
                                                (err, elementoEliminado) => {
                                                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                                    if (!elementoEliminado) return res.status(500).send({ mensaje: "Error al editar la Respuesta" });
                                                    Usuario.findById(req.user.sub, (err, cuentaUsuario) => {
                                                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                        if (!cuentaUsuario) return res.status(500).send({ mensaje: 'Error al encontrar el usuario' });
                                                        for (let i = 0; i < cuentaUsuario.cuenta.length; i++) {
                                                            totalCuenta += cuentaActualizada.cuenta[i].precio;
                                                        }
                                                        Usuario.findByIdAndUpdate(req.user.sub, { total: totalCuenta }, { new: true },
                                                            (err, totalEditado) => {
                                                                if (err) return res.status(500).send({ mensaje: 'Error en la peticion de total Carrito' });
                                                                if (!totalEditado) return res.status(500).send({ mensaje: 'Error al modificar el total del carrito' });
                                                                return res.status(200).send({ usuario: totalEditado });
                                                            })
                                                    });
                                                })
                                        } else {
                                            Usuario.findById(req.user.sub, (err, usuarioEncontrado) => {
                                                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                                if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar el usuario' });
                                                for (let i = 0; i < usuarioEncontrado.cuenta.length; i++) {
                                                    Usuario.findOneAndUpdate({ cuenta: { $elemMatch: { _id: usuarioEncontrado.cuenta[i]._id } } }, { $pull: { cuenta: { _id: usuarioEncontrado.cuenta[i]._id } } }, { new: true },
                                                        (err, elementoEliminado) => {
                                                            if (err) return res.status(404).send({ mensaje: 'Eror en la peticion del Usuario' });
                                                            if (!elementoEliminado) return res.status(500).send({ mensaje: 'Error al actualizar la cuenta' });
                                                        })
                                                }
                                                Usuario.findByIdAndUpdate(req.user.sub, { total: totalCuenta }, { new: true },
                                                    (err, totalEditado) => {
                                                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion de total Carrito' });
                                                        if (!totalEditado) return res.status(500).send({ mensaje: 'Error al modificar el total del carrito' });
                                                        return res.status(200).send({ usuario: totalEditado });
                                                    })
                                            });
                                        }
                                    });
                                })
                            });
                        })
                    } else {
                        Usuario.findOneAndUpdate({ cuenta: { $elemMatch: { _id: idCuenta } } }, {$pull:{cuenta:{_id:idCuenta}}}, {new: true},
                            (err, elementoEliminado) => {
                                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                if (!elementoEliminado) return res.status(500).send({ mensaje: "Error al editar la Respuesta" });
                                Usuario.findById(req.user.sub, (err, cuentaUsuario) => {
                                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                                    if (!cuentaUsuario) return res.status(500).send({ mensaje: 'Error al encontrar el usuario' });
                                    for (let i = 0; i < cuentaUsuario.cuenta.length; i++) {
                                        totalCuenta += cuentaActualizada.cuenta[i].precio;
                                    }
                                    Usuario.findByIdAndUpdate(req.user.sub, { total: totalCuenta }, { new: true },
                                        (err, totalEditado) => {
                                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion de total Carrito' });
                                            if (!totalEditado) return res.status(500).send({ mensaje: 'Error al modificar el total del carrito' });
                                            return res.status(200).send({ usuario: totalEditado });
                                        })
                                });
                            })
                    }
                })
            });
    }else{
        return res.status(500).send({mensaje:'No autorizado'})
    }
}

//Busquedas
function verHabitacionesRegistrados(req, res) {
    if (req.user.rol == 'Cliente') {
        Reserva.find({ idUsuario: hotelEncontrado._id }, (err, habitacionesEncontradas) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!habitacionesEncontradas) return res.status(500).send({ mensaje: 'Error al encontrar las habitaciones encontradas' });
            return res.status(200).send({ habitaciones: habitacionesEncontradas });
        }).populate('idHabitacion', 'tipo');
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

function verUsuariosRegistrados(req, res) {
    if (req.user.rol == 'Admin_Hotel') {
        Hotel.findOne({ idUsuario: req.user.sub }, (err, hotelEncontrado) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!hotelEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar el hotel' });
            Reserva.find({ idHotel: hotelEncontrado._id }, (err, reservasHotel) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                if (!reservasHotel) return res.status(500).send({ mensaje: 'Error al encontrar las habitaciones encontradas' });
                return res.status(200).send({ reservas: reservasHotel });
            }).populate('idUsuario', 'usuario');
        });
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

module.exports = {
    reservar,
    verHabitacionesRegistrados,
    verUsuariosRegistrados,
    cancelarReserva
}