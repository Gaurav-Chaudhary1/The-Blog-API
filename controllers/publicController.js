import Post from '../models/Post.js';

export const getAllPublicPosts = async (req, res) => {
    try {
        const { search, category, sort, page, limit } = req.query;

        // Build query object
        let queryObj = { mode: 'Published' };

        // Add category 
        if (category) {
            queryObj.category = category;
        }

        // Add search 
        if (search) {
            // Ensure search is a string
            const searchString = Array.isArray(search) ? search[0] : search;

            // Split the search string with spaces and create an array of search terms
            const searchWords = searchString.split(' ');

            // Map each word into its own $or condition
            const searchConditions = searchWords.map(word => {
                return {
                    $or: [
                        { title: { $regex: word, $options: 'i' } },
                        { content: { $regex: word, $options: 'i' } }
                    ]
                }
            });
            // Feed the array of strings into the $and operator to ensure all words are matched
            queryObj.$and = searchConditions;
        }

        // Add sorting
        let sortObj = { createdAt: -1 };
        if (sort === 'oldest' ) sortObj = { createdAt: 1 };
        if (sort === 'a-z') sortObj = { title: 1 };

        //Add pagination
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        const posts = await Post.find(queryObj)
            .sort(sortObj)
            .limit(limitNumber)
            .skip(skip)
            .populate('author', 'firstName lastName');
            
        const totalPosts = await Post.countDocuments(queryObj);
        
        res.status(200).json({
            totalPosts,
            totalPages: Math.ceil(totalPosts / limitNumber),
            currentPage: pageNumber,
            posts
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server error', errors: error.message });
    }
};