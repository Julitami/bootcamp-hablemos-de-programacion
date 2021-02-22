const createError = require("http-errors");
const router = require("express").Router();
const Usuario = require("../usuarios/schema");
const jwt = require("jsonwebtoken");
const { manejadorDeErrores } = require("../../../util");
const SECRET_KEY = process.env.SECRET_KEY;

router.post("/", async (req, res, next) => {
  try {
    const { password = null, email = null } = req.body;
    let err = new createError[400]("email o password errados");
    if (password && password.length > 0 && email && email.length > 0) {
      let usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return next(err);
      }
      if (usuario.password === password) {
        usuario = usuario.toJSON();
        const { password, ...datosUsuario } = usuario;
        const token = jwt.sign(datosUsuario, SECRET_KEY, {
          expiresIn: 60 * 60,
        });
        const respuesta = { token, usuario: datosUsuario };
        return res.status(200).json(respuesta);
      }
      return next(err);
    }
  } catch (error) {
    return manejadorDeErrores({ error, next });
  }
});

module.exports = router;
