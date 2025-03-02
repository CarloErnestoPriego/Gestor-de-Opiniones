import { validationResult } from "express-validator";
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
        const { id: postId } = req.params;
        const userId = req.user ? req.user._id.toString() : null;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "No estás autenticado. Por favor inicia sesión.",
            });
        }

        const post = await Post.findById(postId).select("author_id");

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Publicación no encontrada",
            });
        }

        if (post.author_id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para realizar esta acción",
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
        const { commentId } = req.params;
        const userId = req.user.id;

        const comment = await Comment.findById(commentId).select("author_id");

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comentario no encontrado",
            });
        }

        if (comment.author_id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "No eres el autor de este comentario",
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