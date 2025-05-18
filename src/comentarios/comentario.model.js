import { Schema, model } from 'mongoose';

const comentarioSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId,
    required: [true, 'El id de la publicación es requerido'],
    ref: 'Post',
  },
  text: {
    type: String,
    required: true,
  },
  autor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El autor del comentario es requerido'],
  },
  status: {
    type: Boolean,
    default: true,
  },
});

export default model('Comment', comentarioSchema);