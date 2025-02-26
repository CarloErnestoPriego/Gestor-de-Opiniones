import Comment from '../comentarios/comentario.model.js';

export const comentarioExistente = async (id = '') => {
    const comment = await Comment.findById(id);
    if (!comment) {
        throw new Error("Comentario no encontrado");
    }
    return comment;
};