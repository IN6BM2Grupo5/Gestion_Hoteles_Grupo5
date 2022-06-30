const Habitacion = require("../models/habitaciones.models");
const Hotel = require("../models/hoteles.models");

//Agregar
function agregarHabitaciones(req, res) {
    var parametros = req.body;
    var habitacionModel = new Habitacion();
    var idHotel = req.params.idHotel;
    if (req.user.rol == "Admin_APP") {
        if (parametros.tipo && parametros.precio) {
            if (parametros.precio >= 0) {
                habitacionModel.tipo = parametros.tipo;
                habitacionModel.estado = "Disponible";
                habitacionModel.registros = 0;
                habitacionModel.precio = parametros.precio;
                habitacionModel.idHotel = idHotel;
                habitacionModel.save((err, habitacionesGuardadas) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                    if (!habitacionesGuardadas) return res.status(500).send({ mensaje: 'Error al guardar el hotel' });

                    return res.status(200).send({ habitaciones: habitacionesGuardadas })
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
function editarHabitaciones(req, res) {
    var parametros = req.body;
    var idHabitacion = req.params.idHabitacion;
    if (req.user.rol == 'Admin_APP') {
        if (parametros.estado || parametros.registros || parametros.idHotel) return res.status(500).send({ mensaje: 'Estos campos no se pueden ingresar' });
        if (parametros.precio >= 0) {
            Habitacion.findByIdAndUpdate(idHabitacion, parametros, { new: true }, (err, habitacionActualizada) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                if (!habitacionActualizada) return res.status(500).send({ mensaje: 'Error al actualizar la habitacion' });

                return res.status(200).send({ habitacion: habitacionActualizada });
            })
        } else {
            return res.status(500).send({ mensaje: 'Ingrese un precio razonable' });
        }
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

//Eliminar
function eliminarHabitaciones(req, res) {
    var idHabitacion = req.params.idHabitacion;
    if (req.user.rol == "Admin_APP") {
        Habitacion.findByIdAndDelete(idHabitacion, (err, habitacionEliminada) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!habitacionEliminada) return res.status(500).send({ mensaje: 'Error al eliminar la habitacion' });

            return res.status(200).send({ habitacion: habitacionEliminada });
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' })
    }
}

//Buscar
function verHabitaciones(req, res) {
    let idHotel;
    if (req.user.rol == 'Admin_APP' || req.user.rol == 'Cliente') {
        idHotel = req.params.idHotel;
    } else if (req.user.rol == 'Admin_Hotel') {
        Hotel.findOne({ idUsuario: req.user.sub }, (err, hotelEncontrado) => {
            if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
            if (!hotelEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar el hotel en la peticion' });

            idHotel = hotelEncontrado._id;
        });
    }

    Habitacion.find({ idHotel: idHotel }, (err, habitacionesEncontradas) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
        if (!habitacionesEncontradas) return res.status(500).send({ mensaje: 'Error al encontrar las habitaciones encontradas' });

        return res.status(200).send({ habitaciones: habitacionesEncontradas });
    })
}

function verHabitacionPorId(req, res) {
    var idHabitacion = req.params.idHabitacion;
    if (req.user.rol == "Admin_APP") {
        Habitacion.findById(idHabitacion, (err, habitacionEncontrada) => {
            if (err) return res.status(404).send({ mensaje: 'No esta autorizado' });
            if (!habitacionEncontrada) return res.status(500).send({ mensaje: 'Error al encontrar la habitacion' });

            return res.status(200).send({ habitacion: habitacionEncontrada });
        })
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

//Exports
module.exports = {
    agregarHabitaciones,
    editarHabitaciones,
    eliminarHabitaciones,
    verHabitacionPorId,
    verHabitaciones
}