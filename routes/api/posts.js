const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');



//@route POST api/posts
//@desc Create a post 
//@access Private (you have to be logged in to create a post)
router.post('/', [auth, [
    check('text', 'Text must be required').not().isEmpty()

]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: req.body.avatar,
            user: req.user.id
        });
        const post = await newPost.save();
        res.json(post);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//@route GET api/posts
//@desc Get all posts 
//@access Private (you have to be logged in to create a post)
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//@route GET api/posts/:id
//@desc Get post by ID
//@access Private (you have to be logged in to create a post)
router.get('/:id', auth, async (req, res) => {
    try {
        const posts = await Post.findById(req.params.id);
        res.json(post);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        console.error(error.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(500).send('Server error');
    }
});

//@route DELETE api/posts/:id
//@desc Delete a post  
//@access Private (you have to be logged in to create a post)
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //Check if the user owns the post
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'You are not authorized to delete this post' });
        }
        await post.remove();

        res.json({ message: 'message removed' });
    } catch (error) {
        console.error(error.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(500).send('Server error');
    }
});

//@route PUT api/posts/like/:id
//@desc Like a post  
//@access Private (you have to be logged in to create a post)
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // checking if the post is already liked by this user 
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ message: 'Post already liked' });
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(500).send('Server error');
    }
});

//@route PUT api/posts/unlike/:id
//@desc Unlike a post  
//@access Private (you have to be logged in to create a post)
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // checking if the post is already liked by this user 
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ message: 'Post has not yet been liked' });
        }

        // Remove index 
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(500).send('Server error');
    }
});

module.exports = router; 