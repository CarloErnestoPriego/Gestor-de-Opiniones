import { Schema, model } from 'mongoose';

const comentarioSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
    },
    text: {
        type: String,
        required: true,
    },
    author_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: Boolean,
        default: true,
    },
});

export default model('Comment', comentarioSchema);
