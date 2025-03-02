'Hecho por Carlos Priego'

import Comment from '../comentarios/comentario.model.js';
import Post from '../publicaciones/publicaciones.model.js';
import User from '../users/user.model.js';

export const crearComentario = async (req, res) => {
    const postId = req.params.idPost;

    if (!req.usuario) {
        return res.status(400).json({
            success: false,
            message: 'Usuario no autenticado'
        });
    }

    const userId = req.usuario._id;
    const { text } = req.body;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post no encontrado'
            });
        }

        const comment = new Comment({
            postId, text, author_id: userId,
        });

        await comment.save();

        const postAuthor = await User.findById(post.author_id);
        const commentAuthor = await User.findById(comment.author_id);

        const data = {
            post: {
                title: post.title,
                category: post.category,
                text: post.text,
                author: postAuthor.username,
                creation_date: new Date(post.creation_date).toISOString().split('T')[0],
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
        res.status(500).json('Internal Server Error');
    }
};


export const eliminarComentario = async (req, res) => {

    const commentId = req.params.commentId;

    try {
        await Comment.findByIdAndUpdate(commentId, { status: false });

        const comment = await Comment.findOne({ _id: commentId });

        res.status(200).json({
            msg: 'comment was successfully deleted',
            comment,
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }

}

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
        res.status(500).json('Internal Server Error');
    }
}