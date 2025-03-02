// 'Hecho por Carlos Priego'
import { Schema, model } from 'mongoose';

const publicacionesSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
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
