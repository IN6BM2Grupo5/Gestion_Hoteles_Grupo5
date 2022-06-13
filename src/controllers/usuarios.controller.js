const Usuario = require("../models/usuarios.models");

const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");

//Login
function Login(req, res) {
  var parametros = req.body;
  Usuario.findOne({ usuario: parametros.usuario }, (err, usuarioEncontrado) => {
    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
    if (usuarioEncontrado) {
      bcrypt.compare(
        parametros.password,
        usuarioEncontrado.password,
        (err, verificacionPassword) => {
          if (verificacionPassword) {
            if (parametros.obtenerToken === "true") {
              return res.status(200).send({ token: jwt.crearToken(usuarioEncontrado) });
            } else {
              usuarioEncontrado.password = undefined;
              return res.status(200).send({ usuario: usuarioEncontrado });
            }
          } else {
            return res.status(500).send({ mensaje: "Las contraseñas no coinciden" });
          }
        }
      );
    } else {
      return res.status(500).send({ mensaje: "Error, el usuario no se encuentra registrado." });
    }
  });
}
//Agregar
function AdminApp() {
  Usuario.find(
    { rol: "Admin_APP", usuario: "AppAdmin" },
    (err, usuarioEcontrado) => {
      if (usuarioEcontrado.length == 0) {
        bcrypt.hash("123456", null, null, (err, passwordEncriptada) => {
          Usuario.create({
            nombre: undefined,
            cuenta: undefined,
            usuario: "AppAdmin",
            password: passwordEncriptada,
            rol: "Admin_APP",
          });
        });
      }
    }
  );
}

function Registrar(req, res) {
  var parametros = req.body;
  var usuarioModel = new Usuario();

  if (
    parametros.nombre &&
    parametros.usuario &&
    parametros.password
  ) {
    usuarioModel.nombre = parametros.nombreEmpresa;
    usuarioModel.usuario = parametros.usuario;
    usuarioModel.password = parametros.password;
    usuarioModel.cuenta = undefined;
    usuarioModel.rol = "Cliente";

    Usuario.find({ nombre: parametros.nombre }, (err, nombreEncontrado) => {
      if (nombreEncontrado.length == 0) {
        Usuario.find({ usuario: parametros.usuario }, (err, usuarioEncontrado) => {
          if (usuarioEncontrado.length == 0) {
            bcrypt.hash(
              parametros.password,
              null,
              null,
              (err, passwordEncriptada) => {
                usuarioModel.password = passwordEncriptada;

                usuarioModel.save((err, usuarioGuardado) => {
                  if (err)
                    return res.status(500).send({ mensaje: "Error en la peticion" });
                  if (!usuarioGuardado)
                    return res.status(500).send({ mensaje: "Error al agregar el Usuario" });

                  return res.status(200).send({ usuario: usuarioGuardado });
                });
              }
            );
          } else {
            return res.status(500).send({ mensaje: "Este usuario, ya  se encuentra utilizado" });
          }
        });
      } else {
        return res.status(500).send({ mensaje: "Este nombre ya se encuentra utilizado" })
      }
    })
  }
}

function AgregarAdminHotel(req, res) {
  var parametros = req.body;
  var usuarioModel = new Usuario();

  if (req.user.rol == "Admin_APP") {
    if (
      parametros.nombre &&
      parametros.usuario &&
      parametros.password
    ) {
      usuarioModel.nombre = parametros.nombreEmpresa;
      usuarioModel.usuario = parametros.usuario;
      usuarioModel.password = parametros.password;
      usuarioModel.cuenta = undefined;
      usuarioModel.rol = "Admin_Hotel";

      Usuario.find({ nombre: parametros.nombre }, (err, nombreEncontrado) => {
        if (nombreEncontrado.length == 0) {
          Usuario.find({ usuario: parametros.usuario }, (err, usuarioEncontrado) => {
            if (usuarioEncontrado.length == 0) {
              bcrypt.hash(
                parametros.password,
                null,
                null,
                (err, passwordEncriptada) => {
                  usuarioModel.password = passwordEncriptada;

                  usuarioModel.save((err, usuarioGuardado) => {
                    if (err)
                      return res.status(500).send({ mensaje: "Error en la peticion" });
                    if (!usuarioGuardado)
                      return res.status(500).send({ mensaje: "Error al agregar el Usuario" });

                    return res.status(200).send({ usuario: usuarioGuardado });
                  });
                }
              );
            } else {
              return res.status(500).send({ mensaje: "Este usuario, ya  se encuentra utilizado" });
            }
          });
        } else {
          return res.status(500).send({ mensaje: "Este nombre ya se encuentra utilizado" })
        }
      })
    }
  }
}

//Editar

function EditarUsuario(req, res) {
  var parametros = req.body;

  let idUsuario;

  if (req.user.rol == 'Admin_Hotel' || req.user.rol == 'Cliente') {
    idUsuario = req.user.sub
  } else if (req.user.rol == 'Admin_APP') {

    if (req.params.idUsuario == null)
      return res.status(500).send({ mensaje: 'debe enviar el id del usuario' });

    if (req.params.idUsuario == req.user.sub)
      return res.status(500).send({ mensaje: 'error, no puede editar el admin' });

    idUsuario = req.params.idUsuario;
  }

  parametros.rol = undefined;
  Usuario.findOne({ nombre: parametros.nombre }, (err, nombreEncontrado) => {
    if (nombreEncontrado == null || nombreEncontrado._id == idUsuario) {
      Usuario.findOne({ usuario: parametros.usuario }, (err, usuarioEncontrado) => {
        if (usuarioEncontrado == null || usuarioEncontrado._id == idUsuario) {
          Usuario.findByIdAndUpdate(idUsuario, parametros, { new: true },
            (err, usuarioActualizado) => {
              if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });

              if (!usuarioActualizado) return res.status(500).send({ mensaje: 'Error al editar el Usuario' });

              return res.status(200).send({ usuario: usuarioActualizado })
            }
          )
        } else {
          return res.status(500).send({ mensaje: 'Este usuario no esta disponible' })
        }
      })
    } else {
      return res.status(500).send({ mensaje: 'Este nombre no esta disponible' })
    }
  })
}

//Eliminar

function EliminarUsuario(req, res) {
  let idUsuario;

  if (req.user.rol == 'Empresa') {
    idUsuario = req.user.sub
  } else if (req.user.rol == 'Admin') {

    if (req.params.idUsuario == null) {
      return res.status(500).send({ mensaje: 'debe enviar el id del usuario' });
    }

    if (req.params.idUsuario == req.user.sub) {
      return res.status(500).send({ mensaje: 'error, no puede eliminar el admin' });
    }

    idUsuario = req.params.idUsuario;
  }
  Usuario.findByIdAndDelete(idUsuario,
    (err, usuarioActualizado) => {
      if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
      if (!usuarioActualizado) return res.status(500).send({ mensaje: 'Error al eliminar el Usuario' });
      return res.status(200).send({ usuario: usuarioActualizado })
    })

}

//Buscar

function encontrarUsuarios(req, res) {

  if (req.user.rol == 'Admin_APP' || req.user.rol == 'Admin_Hotel') {
    Usuario.find({ rol: "Cliente" }, (err, usuariosEncontrados) => {
      if (usuariosEncontrados.length == 0) return res.status(200).send({ mensaje: "no cuenta con usuarios" })

      return res.status(200).send({ usuarios: usuariosEncontrados })
    })
  } else {
    return res.status(500).send({ mensaje: 'No Esta autorizado para ver los usuarios registados' })
  }
}

function encontrarUsuarioId(req, res) {
  var idUser = req.params.idUsuario;
  Usuario.findById(idUser, (err, usuarioEncontrao) => {
    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
    if (!usuarioEncontrao) return res.status(500).send({ mensaje: "Error al obtener la empresa" });

    return res.status(200).send({ usuario: usuarioEncontrao });
  })
}

//Exports
module.exports = {
  Registrar,
  AgregarAdminHotel,
  Login,
  EditarUsuario,
  EliminarUsuario,
  AdminApp,
  encontrarUsuarioId,
  encontrarUsuarios
};

