import express from 'express';

import { getAllPublicPosts } from '../controllers/publicController.js';

const router = express.Router();

// Route to get all public posts with optional filters
router.get('/posts', getAllPublicPosts);

export default router;
