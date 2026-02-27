import express from 'express';

import { createComment, getCommentsByPost, updateComment, deleteComment } from '../controllers/commentController.js';
import { auth } from '../middleware/auth.js';
import { createCommentSchema, updateCommentSchema } from '../validation/commentValidation.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Create a comment
router.post('/', auth, validate(createCommentSchema), createComment);
//Get all comments for a post
router.get('/post/:postId', getCommentsByPost);
// Update a comment
router.put('/:commentId', auth, validate(updateCommentSchema), updateComment);
// Delete a comment
router.delete('/:commentId', auth, deleteComment);

export default router;