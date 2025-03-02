import Comment from '../comentarios/comentario.model.js';

/**
 * @param {string} commentId 
 * @returns {Promise<Object>}
 * @throws {Error}
 */

export const comentarioExistente = async (commentId = '') => {
    try {
        const comentario = await Comment.findById(commentId);
        
        if (!comentario) {
            throw new Error(`No se encontró el comentario con ID ${commentId}`);
        }
        
        return comentario;
    } catch (error) {
        throw new Error(`Error al buscar el comentario: ${error.message}`);
    }
};
