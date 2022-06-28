const Evento = require("../models/eventos.models");
const Hotel = require("../models/hoteles.models");

//Agregar
function agregarEvento(req, res) {
    var parametros = req.body;
    var eventoModel = new Evento();
    if (req.user.rol == "Admin_Hotel") {
        if (parametros.evento && parametros.tipo) {
            Hotel.findOne({ idUsuario: req.user.sub }, (err, hotelEncontrado) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                if (!hotelEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar el hotel' });
                eventoModel.tipo = parametros.tipo;
                eventoModel.evento = parametros.evento;
                eventoModel.idHotel = hotelEncontrado._id;
                eventoModel.save((err, eventoGuardado) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                    if (!eventoGuardado) return res.status(500).send({ mensaje: 'Error al guardar el evento' });

                    return res.status(200).send({ evento: eventoGuardado })
                });
            })
        } else {
            return res.status(500).send({ mensaje: 'Ingrese los campos necesarios' });
        }
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

//Editar
function editarEvento(req, res) {
    var parametros = req.body;
    var idEvento = req.params.idEvento;
    if (req.user.rol == 'Admin_Hotel') {
        if (parametros.idHotel) return res.status(500).send({ mensaje: 'Estos campos no se pueden ingresar' });
        Evento.findByIdAndUpdate(idEvento, parametros, { new: true }, (err, eventoActualizado) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!eventoActualizado) return res.status(500).send({ mensaje: 'Error al actualizar el evento' });

            return res.status(200).send({ evento: eventoActualizado });
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

//Eliminar
function eliminarEventos(req, res) {
    var idEvento = req.params.idEvento;
    if (req.user.rol == "Admin_Hotel") {
        Hotel.findOne({ idUsuario: req.user.sub }, (err, hotelEncontrado) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!hotelEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar el hotel' });
            Evento.findById(idEvento, (err, eventoEncontrado) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                if (!eventoEncontrado) return res.status(500).send({ mensaje: "Error al encontrar el evento" });
                if (hotelEncontrado._id == eventoEncontrado.idHotel) {
                    Evento.findByIdAndDelete(idEvento, (err, eventoEliminado) => {
                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                        if (!eventoEliminado) return res.status(500).send({ mensaje: 'Error al eliminar el evento' });

                        return res.status(200).send({ eventro: eventoEliminado });
                    })
                } else {
                    return res.status(500).send({ mensaje: 'El evento no pertenece al hotel del administrador' });
                }
            })
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' })
    }
}

//Buscar
function verEventos(req, res) {
    if (req.user.rol == "Admin_Hotel") {
        Hotel.findOne({ idUsuario: req.user.sub }, (err, hotelEncontrado) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!hotelEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar el hotel en la peticion' });
            Evento.find({ idHotel: hotelEncontrado_id }, (err, eventosEncontrados) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                if (!eventosEncontrados) return res.status(500).send({ mensaje: 'Error al encontrar los eventos' });

                return res.status(200).send({ eventos: eventosEncontrados });
            })
        });
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

function verEventoPorId(req, res) {
    var idEvento = req.params.idEvento;
    if (req.user.rol == "Admin_Hotel") {
        Evento.findById(idEvento, (err, eventoEncontrado) => {
            if (err) return res.status(404).send({ mensaje: 'No esta autorizado' });
            if (!eventoEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar el evento' });

            return res.status(200).send({ evento: eventoEncontrado });
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

//Exports
module.exports = {
    agregarEvento,
    editarEvento,
    eliminarEventos,
    verEventos,
    verEventoPorId
}