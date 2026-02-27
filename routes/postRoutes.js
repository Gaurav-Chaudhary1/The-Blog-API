import express from "express";

import {
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
  getPostBySlug,
  showComments,
  replyToComment,
} from "../controllers/postController.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createPostSchema, updatePostSchema } from "../validation/postValidation.js";

const router = express.Router();

// Create a new post
router.post("/create", auth, validate(createPostSchema), createPost);
// Update a post by slug
router.put("/update/:slug", auth, validate(updatePostSchema), updatePost);
// Delete a post by slug
router.delete("/delete/:slug", auth, deletePost);
// Get all post
router.get("/all", auth, getUserPosts);
// Get a post by slug
router.get("/:slug", auth, getPostBySlug);
// Show comments
router.get('/comments/:slug', auth, showComments);
// add comment on our post
router.post('/comments/create/:slug/:commentId', auth, replyToComment);

export default router;
