import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { crearPost, actualizarPost, eliminarPost, feed, detalle } from "../publicaciones/publicaciones.controller.js";
import { validarSolicitud, ValidarPosteoAutor } from "../middlewares/validar-campos.js";
import { publicacionExistente } from "../helpers/validacion-publicaciones.js";

const router = Router();

router.post('/',
    validarJWT,
    [
        check("titulo", "Debe colocar un titulo").not().isEmpty(),
        check("categoria", "Debe colocar una categoria").not().isEmpty(),
        check("descripcion", "Debe colocar una descripcion").not().isEmpty(),
        validarSolicitud,
    ], 
    crearPost
);

router.get(
    '/',
    feed
);


router.put('/:id', 
    validarJWT,
    [
        check("id", "The id is not a valid MongoDB format").isMongoId(),
        check("id").custom(publicacionExistente),
        validarSolicitud,
        ValidarPosteoAutor,
    ], 
    actualizarPost
);

router.get('/:postId',
    [
        check("postId", "The id is not a valid MongoDB format").isMongoId(),
        check("postId").custom(publicacionExistente),
        validarSolicitud,
    ], 
    detalle
);

router.delete('/:id', 
    validarJWT,
    [
        check("id", "The id is not a valid MongoDB format").isMongoId(),
        check("id").custom(publicacionExistente),
        validarSolicitud,
        ValidarPosteoAutor,
    ], 
    eliminarPost
);

export default router;
