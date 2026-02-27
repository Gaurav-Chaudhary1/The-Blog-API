import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

// Create a comment
export const createComment = async (req, res) => {
    try {
        const { content, postId } = req.body;
        const userId = req.user.id;

        // check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
         }

        // Create comment
        const comment = new Comment({
            content,
            userId,
            postId
        }); 

        // Save post
        await comment.save();

        // Add comment to post
        post.comments.push(comment._id);
        await post.save();

        res.status(201).json({ message: 'Comment created succesfully', comment });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error', errors: error.message });
    }
};

// Get all comments for a post
export const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;

        // check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Get comments
        const comments = await Comment.find({ postId }).populate('userId', 'firstName lastName email');

        res.status(200).json({ comments });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error', errors: error.message });
    }
};

// Update a comment
export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        // check if user exists
        const user  = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // check if comment exists
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found'  });
        }

        // check if user is the owner
        const isOwner = await Comment.findOne({ _id: commentId, userId });
        if (!isOwner) {
            return res.status(403).json({ message: 'Forbidden: You can only update your own comments' });
        }

        // Update comment 
        const updatedComment = await Comment.findByIdAndUpdate({ _id: commentId }, { content }, { new: true });

        res.status(200).json({
            message: 'Comment updated successfully',
            comment: updatedComment
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error', errors: error.message });
    }
};

// Delete a comment
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;

        // check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // check if comment exists
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // check if the user is the owner
        const isOwner = await Comment.findOne({ _id: commentId, userId });
        if (!isOwner) {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own comments' });
        }

        // delete comment
        await Comment.findByIdAndDelete(commentId);

        // Remove comment from post
        await Post.findByIdAndUpdate({ _id: comment.postId }, { $pull: { comments: commentId } });

        res.status(200).json({ message: 'Comment deleted succesfully' });
        
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', errors: error.message });
    }
};