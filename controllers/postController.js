import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, content, category, mode } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate slug from title
    const baseSlug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    const uniqueString = Math.random().toString(36).substring(2, 8); // e.g., 'a8f3b1'
    const slug = `${baseSlug}-${uniqueString}`;

    const tag = req.body.tags
      ? req.body.tags.split(",").map((tag) => tag.trim())
      : [];

    // Create new post
    const newPost = new Post({
      title,
      slug,
      content,
      category,
      tags: tag,
      mode,
      author: userId,
      publishedAt: new Date(),
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all posts of the authenticated user
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, category, limit, page, sort } = req.query;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Build query object
    let queryObj = { author: userId };

    // Add search and category filters to query object
    if (search) {
      queryObj.title = { $regex: search, $options: "i" };
    }

    if (category) {
      queryObj.category = category;
    }

    // Set default values for pagination and sorting
    let sortObj = { createdAt: -1 }; // Default sorting by creation date (newest first)
    if (sort === "oldest") sortObj = { createdAt: 1 }; // Sort by creation date (oldest first)
    if (sort === "a-z") sortObj = { title: 1 }; // Sort by title (A-Z)

    // Paginate and sort posts
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const posts = await Post.find(queryObj)
      .sort(sortObj)
      .limit(limitNumber)
      .skip(skip);

    const totalPosts = await Post.countDocuments(queryObj);

    res.status(200).json({
      totalPosts,
      totalPages: Math.ceil(totalPosts / limitNumber),
      currentPage: pageNumber,
      posts,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server error", error: err.message });
  }
};

// Get a post by slug
export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user.id;
    const post = await Post.findOne({ slug, author: userId });

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized access" });
    }

    const user = await User.findById(post.author);
    if (!user) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server error", error: err.message });
  }
};

// Update a post by slug
export const updatePost = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, content, category, mode } = req.body;
    const userId = req.user.id;
    const tag = req.body.tags
      ? req.body.tags.split(",").map((tag) => tag.trim())
      : [];

    const post = await Post.findOne({ slug });

    if (!post) {
      return res.status(401).json({ message: "Post not found" });
    }

    if (post.author.toString() != userId) {
      return res
        .status(403)
        .json({ message: "User not authorized to update this post" });
    }

    const updatedPost = await Post.findOneAndUpdate(
      { slug },
      { title, content, category, mode, tags: tag },
      { new: true },
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server error", error: err.message });
  }
};

// Delete a post by slug
export const deletePost = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user.id;

    const post = await Post.findOne({ slug });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() != userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this post" });
    }

    await Comment.deleteMany({ postId: post._id });

    await Post.findOneAndDelete({ slug });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server error", error: err.message });
  }
};

// Show comments
export const showComments = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user.id;

    // check post
    const post = await Post.findOne({ slug });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // check user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comments = await Comment.find({ postId: post._id }).populate(
      "userId",
      "firstName lastName",
    );
    if (!comments) {
      return res.status(404).json({ message: "No comments found" });
    }

    res.status(200).json(comments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// Reply to comment
export const replyToComment = async (req, res) => {
  try {
    const { slug, commentId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    // check post available
    const post = await Post.findOne({ slug });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // check user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not authorized" });
    }

    // check comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json("Comment not found");
    }

    // create comment
    const userComment = await Comment.findByIdAndUpdate(
      { _id: commentId },
      { $push: { replies: { userId: userId, content: content } } },
      { new: true },
    );

    res.status(200).json({ message: "Comment successful", comment: userComment });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
