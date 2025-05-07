import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";

import { crearComentario, eliminarComentario, actualizarComentario } from "../comentarios/comentario.controller.js";
import { comentarioExistente } from "../helpers/validacion-comentarios.js";
import { publicacionExistente } from "../helpers/validacion-publicaciones.js";
import { validarSolicitud, ValidarComentarioAutor } from "../middlewares/validar-campos.js";

const router = Router();

router.post('/:idPost',
    validarJWT,
    [
        check("idPost", "The id is not a valid MongoDB format").isMongoId(),
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
        check("commentId", "The id is not a valid MongoDB format").isMongoId(),
        ValidarComentarioAutor,
    ], 
    actualizarComentario
);

export default router;