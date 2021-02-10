const express = require('express');
const router = express.Router()
const auth = require('../../middleware/auth');
const {Post, validatePost} = require('../../models/BlogPost');
const {User} = require('../../models/User');
const _ = require('lodash');


router.get("/", async (req, res) => {
    const posts = await Post.find();
    if (!posts) return res.status(200).send('no posts');
    return res.status(200).send(posts);
});

router.get("/:id")
router.get("/liked", auth, async (req, res) => {
    const user = await User.findById(req.user._id);
    const likedPosts = await Post.find().where('_id').in(user.likedPostsId).exec();
    res.status(200).send(likedPosts);
});

router.get("/created", auth, async (req, res) => {
    const user = await User.findById(req.user._id);
    const createdPosts = await Post.find().where('_id').in(user.createdPostsId).exec();
    res.status(200).send(createdPosts);
});

router.post('/', auth, async (req, res) => {
    const user = await User.findById(req.user._id);
    const error = validatePost(req.body);
    if (error.error) return res.status(400).send(error.error.details[0].message);
    const blogPost = new Post(_.pick(req.body, ['title', 'content']));
    blogPost.userId = req.user._id;
    blogPost.username = user.username;
    await blogPost.save();
    user.createdPostsId.push(blogPost._id);
    await user.save();
    return res.send(blogPost);
});

router.put("/:id", auth, async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).send('post doesn\'t exist');

    const canUpdate = (post.userId === req.user._id);
    if (!canUpdate) return res.status(401).send("permission denied: you can\'t delete this post");

    const error = validatePost(req.body);
    if (error.error) return res.status(400).send(error.error.details[0].message);

    post.title = req.body.title;
    post.content = req.body.content;
    await post.save();
    return res.status(200).send(post);
});

router.delete("/:id", auth, async (req, res) => {
    // a post can be deleted by its creator or an admin
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).send('post doesn\'t exist');

    const postOwnerId = post.userId;
    const canDelete = (req.user.isAdmin || postOwnerId === req.user._id)
    if (!canDelete) return res.status(401).send('permission denied: you can\'t delete this post');
    await post.remove();
    const user = await User.findById(post.userId);
    user.createdPostsId.remove(post._id);
    await user.save();
    res.status(200).send(post);
});

// like
router.get("/liketoggle/:id", auth, async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).send('post doesn\'t exist');

    const user = await User.findById(req.user._id);
    if (user.likedPostsId.indexOf(post._id) === -1) { //if not already liked
        post.likes = post.likes + 1;
        user.likedPostsId.push(post._id);
    } else {
        post.likes = post.likes - 1;
        user.likedPostsId.remove(post._id);
    }

    await post.save();
    await user.save();
    return res.status(200).send(post);
});

module.exports = router;
