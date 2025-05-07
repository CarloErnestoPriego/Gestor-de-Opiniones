import mongoose from 'mongoose';
import Post from '../publicaciones/publicaciones.model.js';
import User from '../users/user.model.js';
import Comment from '../comentarios/comentario.model.js';

export const crearComentario = async (req, res) => {
    const { postId, text } = req.body;  // Leer postId desde el cuerpo de la solicitud
    const userId = req.user._id; 

    try {
        console.log('postId recibido:', postId);

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de publicación no válido',
                receivedPostId: postId,
            });
        }

        const post = await Post.findOne({ _id: postId });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada',
            });
        }

        const comment = new Comment({
            postId, text, author_id: userId,
        });

        await comment.save();

        const postAuthor = await User.findOne({ _id: post.idAutor });
        const commentAuthor = await User.findOne({ _id: comment.author_id });

        const data = {
            post: {
                title: post.titulo,
                category: post.categoria,
                description: post.descripcion,
                author: postAuthor.username,
                creation_date: new Date(post.fechaCreacion).toISOString().split('T')[0],
            },
            comment: {
                comment: comment.text,
                author: commentAuthor.username,
            }
        };

        res.status(201).json({
            data
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message,
            stack: error.stack,
        });
    }
};

export const eliminarComentario = async (req, res) => {
    const commentId = req.params.commentId;

    try {
        await Comment.findByIdAndUpdate(commentId, { status: false });
        const comment = await Comment.findOne({ _id: commentId });
        res.status(200).json({
            msg: 'Comentario eliminado',
            comment,
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json('Error interno del servidor');
    }
};

export const actualizarComentario = async (req, res) => {
    const commentId = req.params.commentId;
    const { _id, author_id, ...rest } = req.body;

    try {
        await Comment.findByIdAndUpdate(commentId, rest)
        const comment = await Comment.findOne({ _id: commentId })
        res.status(200).json({
            comment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json('Error interno del servidor');
    }
};