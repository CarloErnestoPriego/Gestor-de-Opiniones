// 'Hecho por Carlos Priego'
import { Schema, model } from 'mongoose';

const publicacionesSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'La categoría es obligatoria'],
    },
    descripcion: {
        type: String,
        required: true
    },
    idAutor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    fechaCreacion: {
        type: Date, default: Date.now
    },
    status: {
        type: Boolean,
        default: true
    },
});

export default model('Post', publicacionesSchema);
