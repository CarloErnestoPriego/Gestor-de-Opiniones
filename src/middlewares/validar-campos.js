import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import Post from "../publicaciones/publicaciones.model.js";
import Comment from "../comentarios/comentario.model.js";

export const validarCampos = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(errors);
    }

    next();
}

export const validarSolicitud = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Errores de validación",
            errors: errors.array()
        });
    }
    next();
};

export const ValidarPosteoAutor = async (req, res, next) => {
    try {
        // Obtener el token del cuerpo de la petición
        const { token } = req.body;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token requerido para la autenticación.",
            });
        }

        // Verificar el token con la clave secreta
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY); // Usa la clave definida en tu .env
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token inválido o expirado.",
            });
        } 

        const userId = decoded.uid; // Aquí se extrae correctamente el ID del usuario
        const { id: postId } = req.params;

        // Validar que el postId sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: "El ID del post no es válido.",
            });
        }

        // Buscar la publicación y traer el idAutor
        const post = await Post.findById(postId).select("idAutor");

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Publicación no encontrada.",
            });
        }

        if (!post.idAutor) {
            return res.status(500).json({
                success: false,
                message: "Error en la estructura del post: el campo idAutor no existe.",
            });
        }

        // Comparar el autor del post con el usuario autenticado
        if (post.idAutor.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para realizar esta acción.",
            });
        }

        req.post = post;
        next();

    } catch (error) {
        console.error("Error validando al autor:", error);
        res.status(500).json({
            success: false,
            message: "ERROR DEL SERVIDOR",
            error: error.message,
        });
    }
};

export const ValidarComentarioAutor = async (req, res, next) => {
    try {
        // Obtener el token del cuerpo de la petición
        const { token } = req.body;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token requerido para la autenticación.",
            });
        }

        // Verificar el token con la clave secreta
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY); // Usa la clave definida en tu .env
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token inválido o expirado.",
            });
        }

        const userId = decoded.uid; // Aquí se extrae correctamente el ID del usuario
        const { commentId } = req.params;

        // Validar que el commentId sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({
                success: false,
                message: "El ID del comentario no es válido.",
            });
        }

        // Buscar el comentario y traer el author_id
        const comment = await Comment.findById(commentId).select("author_id");

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comentario no encontrado.",
            });
        }

        // Comparar el autor del comentario con el usuario autenticado
        if (comment.author_id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "No eres el autor de este comentario.",
            });
        }

        req.comment = comment;
        next();

    } catch (error) {
        console.error("Error validando autor:", error);
        res.status(500).json({
            success: false,
            message: "ERROR DEL SERVIDOR",
            error: error.message,
        });
    }
};