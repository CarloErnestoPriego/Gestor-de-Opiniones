'Hecho por Carlos Priego'

import Post from '../publicaciones/publicaciones.model.js';
import Comment from '../comentarios/comentario.model.js';
import User from '../users/user.model.js';

export const crearPost = async (req, res) => {
    const userId = req.idUsuario;
    const { titulo, categoria, descripcion } = req.body;

    try {

        const posts = new Post({
            titulo, categoria, descripcion, idUsuario: userId,
        });

        await posts.save();

        res.status(201).json({
            posts
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error',
        })
    }
}

export const actualizarPost = async (req, res) => {

    const { id } = req.params;
    const { _id, author_id, ...rest } = req.body;

    try {
        await Posts.findByIdAndUpdate(id, rest)

        const posts = await Posts.findOne({ _id: id })

        res.status(200).json({
            posts
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error',
        })
    }
};

export const eliminarPost = async (req, res) => {

    const { id } = req.params;
    try {
        await Posts.findByIdAndUpdate(id, { state: false });

        const posts = await Posts.findOne({ _id: id });

        res.status(200).json({
            msg: 'Se elimino exitosamente el post',
            posts,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json('Internal Server Error');
    }
}

export const feed = async (req, res) => {

    const { limit, offset } = req.query;
    const query = { state: true };

    try {
        const [total, posts] = await Promise.all([
            Posts.countDocuments(query),
            Posts.find(query)
                .skip(Number(offset))
                .limit(Number(limit))
        ]);

        const formattedPosts = posts.map(post => ({
            _id: post._id,
            title: post.title,
            creation_date: new Date(post.creation_date).toISOString().split('T')[0],
        }));

        res.status(200).json({
            total,
            posts: formattedPosts
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Internal Server Error' 
        });
    }
};

export const detallesPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Posts.findById(postId);
        const comments = await Comment.find({ postId: postId });

        const postAuthor = await User.findOne({ _id: post.author_id });

        const commentsDetails = await Promise.all(comments
            .filter(comment => comment.status === true)
            .map(async comment => {
                const commentAuthor = await User.findOne({ _id: comment.author_id });
                return {
                    id: comment._id,
                    comment: comment.text,
                    author: commentAuthor.username,
                };
            }));

        const details = {
            post: {
                title: post.title,
                category: post.category,
                text: post.text,
                author: postAuthor.username,
                creation_date: new Date(post.creation_date).toISOString().split('T')[0],
            },
            comments: commentsDetails,
        };

        res.status(200).json({ details });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error' 
        });
    }
};