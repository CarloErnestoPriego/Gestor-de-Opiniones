import { Schema, model } from 'mongoose';

const publicacionesSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    autor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: true
    },
});

export default model('Post', publicacionesSchema);