import Post from '../publicaciones/publicaciones.model.js';

export const publicacionExistente = async (id = '') => {
    const post = await Post.findById(id);
    if (!post) {
        throw new Error("Publicacion no encontrada");
    }
    return post;
};