// 'Hecho por Carlos Priego'

import { Schema, model } from 'mongoose';

const comentarioSchema = new Schema({
    idPost: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
    },
    descripcion: {
        type: String,
        required: true,
    },
    idUsuario: {    // Autor del comentario
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    estado: {
        type: Boolean,
        default: true,
    },
});

export default model('Comment', comentarioSchema);
