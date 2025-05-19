import Post from "../publicaciones/publicaciones.model.js";
import Comment from "../comentarios/comentario.model.js";
import User from "../users/user.model.js";

export const crearPost = async (req, res) => {
  const { autor, titulo, categoria, descripcion } = req.body;

  try {
    const post = new Post({
      titulo,
      categoria,
      descripcion,
      autor,
    });

    await post.save();

    res.status(201).json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error interno del servidor");
  }
};

export const feed = async (req, res) => {
  const { limit = 10, offset = 0 } = req.query;
  const query = { status: true };

  try {
    const [total, posts] = await Promise.all([
      Post.countDocuments(query),
      Post.find(query)
        .populate("autor", "username")
        .populate("categoria", "category")
        .skip(Number(offset))
        .limit(Number(limit)),
    ]);

    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        const comments = await Comment.find({ postId: post._id, status: true });

        const formattedComments = await Promise.all(
          comments.map(async (comment) => {
            const autor = await User.findById(comment.autor);
            return {
              id: comment._id,
              comment: comment.text,
              author: autor ? autor.username : "Usuario desconocido",
            };
          })
        );

        return {
          _id: post._id,
          titulo: post.titulo,
          descripcion: post.descripcion,
          categoria: post.categoria
            ? post.categoria.category
            : "Categoría eliminada",
          autor: post.autor || { username: "Autor desconocido" },
          fechaCreacion: new Date(post.fechaCreacion)
            .toISOString()
            .split("T")[0],
          comentarios: formattedComments,
        };
      })
    );

    res.status(200).json({
      total,
      posts: formattedPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const actualizarPost = async (req, res) => {
  const { id } = req.params;
  const { _id, author_id, ...rest } = req.body;

  try {
    await Post.findByIdAndUpdate(id, rest);
    const post = await Post.findById(id)
      .populate("usuarios", "username")
      .populate("categoria", "category");

    res.status(200).json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error interno del servidor");
  }
};

export const eliminarPost = async (req, res) => {
  const { id } = req.params;
  try {
    await Post.findByIdAndUpdate(id, { status: false });
    const post = await Post.findById(id)
      .populate("usuarios", "username")
      .populate("categoria", "category");

    res.status(200).json({
      msg: "Publicación deshabilitada correctamente",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Error interno del servidor");
  }
};

export const detalle = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId)
      .populate("autor", "username")
      .populate("categoria", "category");

    if (!post) {
      return res
        .status(404)
        .json({ message: "El post no existe en la base de datos" });
    }

    const comments = await Comment.find({ postId: postId });

    const commentsDetails = await Promise.all(
      comments
        .filter((comment) => comment.status === true)
        .map(async (comment) => {
          const commentAuthor = await User.findById(comment.author_id);
          return {
            id: comment._id,
            comment: comment.text,
            author: commentAuthor
              ? commentAuthor.username
              : "Usuario desconocido",
          };
        })
    );

    const details = {
      post: {
        titulo: post.titulo,
        categoria: post.categoria
          ? post.categoria.category
          : "Categoría eliminada",
        descripcion: post.descripcion,
        autor: post.autor ? post.autor.username : "Autor desconocido",
        fechaCreacion: new Date(post.fechaCreacion).toISOString().split("T")[0],
      },
      comments: commentsDetails,
    };

    res.status(200).json({ details });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};