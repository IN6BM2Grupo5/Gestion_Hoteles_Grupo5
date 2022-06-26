const Habitacion = require("../models/habitaciones.models");
const Hotel = require("../models/hoteles.models");

//Agregar
function agregarHabitaciones(req,res){
    var parametros = req.body;
    var habitacionModel = new Hotel();
    var idHotel = req.params.idHotel;
    if(req.user.rol == "Admin_Hotel"){
        Hotel.findById(idHotel,(err, hotelEncontrado) => {
            if(err) return res.status(404).send({mensaje:'Error en la peticion'});
            if(!hotelEncontrado) return res.status(500).send({mensaje:'Error al encontrar el hotel encontrado'});
            if(req.user.sub == hotelEncontrado.idUsuario){
                habitacionModel.tipo = parametros.tipo;
                habitacionModel.estado = "Disponible";
                habitacionModel.registros= 0;
                habitacionModel.precio = parametros.precio;
                habitacionModel.idHotel = idHotel;
                
            }else{
                return res.status(500).send({mensaje:'No es el administrador del hotel'})
            }
        })
    }else{
        return res.status(500).send({mensaje:'No esta autorizado'});
    }
}

//Editar

//Eliminar

//Buscar

//Exports