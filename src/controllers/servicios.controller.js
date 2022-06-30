const Servicio = require("../models/servicios.models");
const Hotel = require("../models/hoteles.models");

//Agregar
function agregarServicio(req, res) {
    var parametros = req.body;
    var servicioModel = new Servicio();
    var idHotel = req.params.idHotel;
    if (req.user.rol == "Admin_Hotel") {
        if (parametros.servicio && parametros.precio) {
            if (parametros.precio >= 0) {
                servicioModel.servicio = parametros.servicio;
                servicioModel.precio = parametros.precio;
                servicioModel.idHotel = idHotel;
                servicioModel.save((err, servicioGuardado) => {
                    if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                    if (!servicioGuardado) return res.status(500).send({ mensaje: 'Error al guardar el hotel' });

                    return res.status(200).send({ servicio: servicioGuardado })
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
            Servicio.findByIdAndUpdate(idServicio, parametros, { new: true }, (err, servicioActualizado) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                if (!servicioActualizado) return res.status(500).send({ mensaje: 'Error al actualizar la habitacion' });

                return res.status(200).send({ servicio: servicioActualizado });
            })
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
    var idHotel;
    if(req.user.rol=='Admin_APP' || req.user.rol == 'Cliente'){
        idHotel = req.params.idHotel;
    }else if(req.user.rol == 'Admin_Hotel'){
        Hotel.findOne({idUsuario:req.user.sub},(err,hotelEncontrado)=>{
            if(err) return res.status(404).send({mensaje:'Error en la peticion'});
            if(!hotelEncontrado) return res.status(500).send({mensaje:'Error al encontrar el hotel en la peticion'});
            
            idHotel = hotelEncontrado._id;
        });
    }

    Servicio.find({ idHotel: idHotel }, (err, serviciosEncontrados) => {
        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
        if (!serviciosEncontrados) return res.status(500).send({ mensaje: 'Error al encontrar las habitaciones encontradas' });

        return res.status(200).send({ servicios: serviciosEncontrados });
    })

}

function verServiciosId(req, res) {
    var idServicio = req.params.idServicio;
    if (req.user.rol == "Admin_Hotel") {
        Servicio.findById(idServicio, (err, servicioEncontrado) => {
            if (err) return res.status(404).send({ mensaje: 'No esta autorizado' });
            if (!servicioEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar la habitacion' });

            return res.status(200).send({ servicio: servicioEncontrado });
        })
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
    verServiciosId
}