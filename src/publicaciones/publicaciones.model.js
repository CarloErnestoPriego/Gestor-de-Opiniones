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
    idUsuario: { // Autor de la publicación
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    fechaCreacion: {
        type: Date, 
        default: Date.now
    },
    estado: {
        type: Boolean,
        default: true
    },
});

export default model('Post', publicacionesSchema);
