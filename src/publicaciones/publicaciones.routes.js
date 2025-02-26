'Hecho por Carlos Priego'

import { Router } from "express";
import { check } from "express-validator";
import { validarSolicitud, ValidarPosteoAutor } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { publicacionExistente } from "../helpers/validacion-publicaciones.js";
import { crearPost, actualizarPost, eliminarPost, feed, detallesPost } from "../publicaciones/publicaciones.controller.js";

const router = Router();

router.post('/',
    validarJWT,
    [
        check("titulo", "Obligatory field").not().isEmpty(),
        check("categoria"),
        check("descripcion"),
        validarSolicitud,
    ], 
    crearPost
);

router.get(
    '/',
    feed
);

router.get('/:postId',
    [
        check("postId", "The id is not a valid MongoDB format").isMongoId(),
        check("postId").custom(publicacionExistente),
        validarSolicitud,
    ], 
    detallesPost
);


router.put('/:id', validarJWT,
    [
        check("id", "The id is not a valid MongoDB format").isMongoId(),
        check("id").custom(publicacionExistente),
        validarSolicitud,
        ValidarPosteoAutor,
    ], 
    actualizarPost
);

router.delete('/:id', validarJWT,
    [
        check("id", "The id is not a valid MongoDB format").isMongoId(),
        check("id").custom(publicacionExistente),
        validarSolicitud,
        ValidarPosteoAutor,
    ], 
    eliminarPost
);

export default router;