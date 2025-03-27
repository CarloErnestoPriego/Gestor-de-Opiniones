import Comment from '../comentarios/comentario.model.js';
import Post from '../publicaciones/publicaciones.model.js';
import User from '../users/user.model.js';

export const crearComentario = async (req, res) => {
    const postId = req.params.postId;
    const userId = req.user._id;
    const { text } = req.body;

    try {
        const post = await Post.findOne({ _id: postId });

        const comment = new Comment({
            postId, text, author_id: userId,
        });

        await comment.save();

        const postAuthor = await User.findOne({ _id: post.author_id });
        const commentAuthor = await User.findOne({ _id: comment.author_id });

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
            msg: 'Comentario desactivado',
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