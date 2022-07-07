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
                                                precio: infoHabitacion.precio, cantidad: 1, idHabitacion: idHabitacion
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
                                                        reservaModel.save((err,reservaGuardada)=>{
                                                            if(err) return res.status(404).send({mensaje:'Error en la peticion'});
                                                            if(!reservaGuardada) return res.status(500).send({mensaje:'Error al guardar la reserva'});
                                                            return res.status(200).send({reserva:reservaGuardada});
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

module.exports = {
    reservar
}