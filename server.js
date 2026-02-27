import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// User Routes
import userRoutes from './routes/userRoutes.js';
// Post Routes
import postRoutes from './routes/postRoutes.js';
// Public Routes
import publicRoutes from './routes/publicRoutes.js';
// Comment Routes
import commentRoutes from './routes/commentRoutes.js';

dotenv.config();

const app = express();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/comments', commentRoutes);

// Connect to MongoDB and start the server
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Database connected successfully');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });
    