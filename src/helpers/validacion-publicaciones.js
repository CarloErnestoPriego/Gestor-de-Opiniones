import Post from '../publicaciones/publicaciones.model.js';

/**
 * @param {string} postId 
 * @returns {Promise<Object>}
 * @throws {Error}
 */

export const publicacionExistente = async (postId = '') => {
    try {
        const publicacion = await Post.findById(postId);

        if (!publicacion) {
            throw new Error(`No se encontró la publicación con ID ${postId}`);
        }

        return publicacion;
    } catch (error) {
        throw new Error(`Error al buscar la publicación: ${error.message}`);
    }
};
