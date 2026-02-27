import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug:{
        type: String,
        unique: true,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        enum: ['Technology', 'Health', 'Lifestyle', 'Education', 'Entertainment'],
        type: String,
        required: true 
    },
    mode: {
        enum: ['Draft', 'Published'],
        type: String,
        default: 'Draft'
    },
    tags: [{
        type: String,
        trim: true,
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    publishedAt: {
        type: Date
    },
}, { timestamps: true });

export default mongoose.model('Post', postSchema);