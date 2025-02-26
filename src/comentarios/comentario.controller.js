'Hecho por Carlos Priego'

import Comment from '../comentarios/comentario.model.js';
import Post from '../publicaciones/publicaciones.model.js';
import User from '../users/user.model.js';

export const crearComentario = async (req, res) => {
    const postId = req.params.idPost;
    const userId = req.user._id; 
    const { text } = req.body; 

    try {
        const post = await Post.findOne({ _id: postId });
        if (!post) {
            return res.status(404).json({ message: "Post no encontrado" });
        }

        const comment = new Comment({
            idPost: postId,
            descripcion: text, 
            idUsuario: userId,
        });

        await comment.save();

        const postAuthor = await User.findById(post.idUsuario);
        const commentAuthor = await User.findById(comment.idUsuario);

        const data = {
            post: {
                titulo: post.titulo,
                categoria: post.categoria,
                descripcion: post.descripcion,
                Autor: postAuthor ? postAuthor.username : "Desconocido",
                fechaCreacion: new Date(post.fechaCreacion).toISOString().split('T')[0], 
            },
            comentario: {
                comment: comment.descripcion, 
                author: commentAuthor ? commentAuthor.username : "Anónimo",
            },
        };

        res.status(201).json({
            success: true,
            data,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};


export const eliminarComentario = async (req, res) => {

    const commentId = req.params.commentId;
    try {
        await Comment.findByIdAndUpdate(commentId, { status: false });

        const comment = await Comment.findOne({ _id: commentId });

        res.status(200).json({
            msg: 'El comentario se elimino correctamente',
            comment,
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
        });
        console.error(error);
    }

}

export const actualizarComentario = async (req, res) => {

    const commentId = req.params.commentId;
    const { _id, idUsuario, ...rest } = req.body;

    try {
        await Comment.findByIdAndUpdate(commentId, rest)

        const comment = await Comment.findOne({ _id: commentId })

        res.status(200).json({
            comment
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
        })
        console.error(error);
    }
}