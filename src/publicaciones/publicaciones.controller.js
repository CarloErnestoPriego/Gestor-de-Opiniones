import Post from '../publicaciones/publicaciones.model.js';
import Comment from '../comentarios/comentario.model.js';
import User from '../users/user.model.js';

export const crearPost = async (req, res) => {

    const userId = req.user._id;

    const { titulo, categoria, descripcion } = req.body;

    try {
        const post = new Post({
            titulo,
            categoria,
            descripcion,
            idAutor: userId,
        });

        await post.save();

        res.status(201).json({
            post
        });
    } catch (error) {
        res.status(500).json('Error interno del servidor');
        console.error(error);
    }
}

export const feed = async (req, res) => {
    const { limit, offset } = req.query;
    const query = { status: true };

    try {
        const [total, posts] = await Promise.all([
            Post.countDocuments(query),
            Post.find(query)
                .skip(Number(offset))
                .limit(Number(limit))
        ]);

        const formattedPosts = posts.map(post => ({
            _id: post._id,
            titulo: post.titulo,
            descripcion: post.descripcion,
            categoria: post.categoria,
            fechaCreacion: new Date(post.fechaCreacion).toISOString().split('T')[0],
        }));

        res.status(200).json({
            total,
            posts: formattedPosts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const actualizarPost = async (req, res) => {
    const { id } = req.params;
    const { _id, author_id, ...rest } = req.body;

    try {
        await Post.findByIdAndUpdate(id, rest)

        const posts = await Post.findOne({ _id: id })

        res.status(200).json({
            posts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json('Error interno del servidor');
    }
};


export const eliminarPost = async (req, res) => {
    const { id } = req.params;
    try {
        await Post.findByIdAndUpdate(id, { status: false });

        const post = await Post.findOne({ _id: id });

        res.status(200).json({
            msg: 'Publicación desabilitada correctamente',
            post,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json('Error interno del servidor');
    }
}

export const detalle = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "El post no existe en la base de datos" });
        }

        const comments = await Comment.find({ postId: postId });
        const postAuthor = await User.findOne({ _id: post.idAutor });

        const commentsDetails = await Promise.all(comments
            .filter(comment => comment.status === true)
            .map(async comment => {
                const commentAuthor = await User.findOne({ _id: comment.author_id });
                return {
                    id: comment._id,
                    comment: comment.text,
                    author: commentAuthor ? commentAuthor.username : "Usuario desconocido",
                };
            }));

        const details = {
            post: {
                titulo: post.titulo,
                categoria: post.categoria,
                descripcion: post.descripcion,
                author: postAuthor ? postAuthor.username : "Autor desconocido",
                fechaCreacion: new Date(post.fechaCreacion).toISOString().split('T')[0],
            },
            comments: commentsDetails,
        };

        res.status(200).json({ details });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
