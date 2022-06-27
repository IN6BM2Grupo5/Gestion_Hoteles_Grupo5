const Habitacion = require("../models/habitaciones.models");
const Hotel = require("../models/hoteles.models");

//Agregar
function agregarHabitaciones(req, res) {
    var parametros = req.body;
    var habitacionModel = new Habitacion();
    if (req.user.rol == "Admin_Hotel") {
        if (parametros.tipo && parametros.precio) {
            Hotel.findOne({ idUsuario: req.user.sub }, (err, hotelEncontrado) => {
                if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                if (!hotelEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar el hotel encontrado' });
                if (parametros.precio >= 0) {
                    habitacionModel.tipo = parametros.tipo;
                    habitacionModel.estado = "Disponible";
                    habitacionModel.registros = 0;
                    habitacionModel.precio = parametros.precio;
                    habitacionModel.idHotel = hotelEncontrado._id;
                    habitacionModel.save((err, habitacionesGuardadas) => {
                        if (err) return res.status(404).send({ mensaje: 'Error en la peticion' });
                        if (!habitacionesGuardadas) return res.status(500).send({ mensaje: 'Error al guardar el hotel' });

                        return res.status(200).send({ habitaciones: habitacionesGuardadas })
                    });
                } else {
                    return res.status(500).send({ mensaje: 'Ingrese un precio razonable' });
                }
            })
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
    if (req.user.rol == 'Admin_Hotel') {
        if (parametros.estado || parametros.registros || parametros.idHotel) return res.status(500).send({mensaje:'Estos campos no se pueden ingresar'});
        if(parametros.precio>=0){
            Habitacion.findByIdAndUpdate(idHabitacion, parametros, { new: true }, (err,habitacionActualizada)=>{
                if(err) return res.status(404).send({mensaje:'Error en la peticion'});
                if(!habitacionActualizada) return res.status(500).send({mensaje:'Error al actualizar la habitacion'});

                return res.status(200).send({habitacion:habitacionActualizada});
            })
        }else{
            return res.status(500).send({mensaje:'Ingrese un precio razonable'});
        }
    } else {
        return res.status(500).send({ mensaje: 'No esta autorizado' });
    }
}

//Eliminar
function eliminarHabitaciones(req,res){
    var idHabitacion = req.params.idHabitacion;
    if(req.user.rol == "Admin_Hotel"){
        Hotel.findOne({idUsuario:req.user.sub},(err,hotelEncontrado)=>{
            if(err) return res.status(404).send({mensaje:'Error en la peticion'});
            if(!hotelEncontrado) return res.status(500).send({mensaje:'Error al encontrar el hotel'});
            Habitacion.findById(idHabitacion,(err,habitacionEncontrada)=>{
                if(err) return res.status(404).send({mensaje:'Error en la peticion'});
                if(!habitacionEncontrada) return res.status(500).send({mensaje:"Error al encontrar la habitacion"});
                if(hotelEncontrado._id==habitacionEncontrada.idHotel){
                    Habitacion.findByIdAndDelete(idHabitacion,(err,habitacionEliminada)=>{
                        if(err) return res.status(404).send({mensaje:'Error en la peticion'});
                        if(!habitacionEliminada) return res.status(500).send({mensaje:'Error al eliminar la habitacion'});

                        return res.status(200).send({habitacion:habitacionEliminada});
                    })
                }else{
                    return res.status(500).send({mensaje:'La habitacion no pertenece al hotel del administrador'});
                }
            })
        })
    }else{
        return res.status(500).send({mensaje:'No esta autorizado'})
    }
}

//Buscar
function verHabitaciones(req,res){
    if(req.user.rol == "Admin_Hotel"){
        Hotel.findOne({idUsuario:req.user.sub},(err,hotelEncontrado)=>{
            if(err) return res.status(404).send({mensaje:'Error en la peticion'});
            if(!hotelEncontrado) return res.status(500).send({mensaje:'Error al encontrar el hotel en la peticion'});
            Habitacion.find({idHotel:hotelEncontrado_id},(err,habitacionesEncontradas)=>{
                if(err) return res.status(404).send({mensaje:'Error en la peticion'});
                if(!habitacionesEncontradas) return res.status(500).send({mensaje:'Error al encontrar las habitaciones encontradas'});
                
                return res.status(200).send({habitaciones:habitacionesEncontradas});
            })
        });
    }else{
        return res.status(500).send({mensaje:'No esta autorizado'});
    }
}

function verHabitacionPorId(req,res){
    var idHabitacion = req.params.idHabitacion;
    if(req.user.rol == "Admin_Hotel"){
        Hotel.findById(idHabitacion,(err,habitacionEncontrada)=>{
            if(err) return res.status(404).send({mensaje:'No esta autorizado'});
            if(!habitacionEncontrada) return res.status(500).send({mensaje:'Error al encontrar la habitacion'});

            return res.status(200).send({habitacion:habitacionEncontrada});
        })
    }else{
        return res.status(500).send({mensaje:'No esta autorizado'});
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