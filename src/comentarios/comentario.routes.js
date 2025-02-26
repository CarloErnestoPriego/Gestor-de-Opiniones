'Hecho por Carlos Priego'

import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarSolicitud, ValidarComentarioAutor } from "../middlewares/validar-campos.js";
import { publicacionExistente } from "../helpers/validacion-publicaciones.js";
import { comentarioExistente } from "../helpers/validacion-comentarios.js";
import { crearComentario, eliminarComentario, actualizarComentario } from "../comentarios/comentario.controller.js";

const router = Router();

router.post('/:idPost',
    validarJWT,
    [
        check("postId", "El id no es un formato valido para MongoDB").isMongoId(),
        check("postId").custom(publicacionExistente),
        validarSolicitud,
    ], 

    crearComentario
);

router.delete('/:commentId',
    validarJWT,
    [
        check("commentId", "El id no es un formato valido para MongoDB").isMongoId(),
        check("commentId").custom(comentarioExistente),
        validarSolicitud,
        ValidarComentarioAutor,
    ],

    eliminarComentario
);

router.put('/:commentId',
    validarJWT,
    [
        check("commentId", "El id no es un formato valido para MongoDB").isMongoId(),
        check("commentId").custom(comentarioExistente),
        validarSolicitud,
        ValidarComentarioAutor,
    ], 

    actualizarComentario
);

export default router;