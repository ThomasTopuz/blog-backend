const express = require('express');
const router = express.Router()
const auth = require('../../middleware/auth');
const {Post, validatePost} = require('../../models/BlogPost');
const _ = require('lodash');

router.post('/', auth, async (req, res) => {
    const error = validatePost(req.body);
    console.log(error)
    if (error.error) return res.status(400).send(error.error.details[0].message);
    const blogPost = new Post(_.pick(req.body, ['title', 'content']));
    blogPost.userId = req.user._id;
    await blogPost.save();
    return res.send(blogPost);
});

router.delete("/:id", auth, async (req, res) => {
    // a post can be deleted by its creator or an admin
    const post = await Post.findById(req.params.id);
    const postOwnerId = post.userId;
    const canDelete = (req.user.isAdmin || postOwnerId === req.user._id)
    if (!canDelete) return res.status(403).send('permission denied: you can\'t delete this post');
    await post.remove();
    res.status(200).send(post);
});

router.put("/:id", auth, async (req, res) => {
    const post = await Post.findById(req.params.id);
    const canUpdate = (post.userId === req.user._id);
    if (!canUpdate) return res.status(401).send("permission denied: you can\'t delete this post");

    const error = validatePost(req.body);
    if(error.error) return res.status(400).send(error.error.details[0].message);

    post.title = req.body.title;
    post.content = req.body.content;
    await post.save();
    return res.status(200).send(post);
});


module.exports = router;
