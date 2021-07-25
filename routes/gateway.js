const express = require('express');
const router = express.Router()
const blogPostsRouter = require('./blogPosts/blogPosts');
const usersRouter = require('./auth/users');

router.get("/health", (req, res) => {
    res.status(200).send("REST API WORKS :)");
});

router.use("/users", usersRouter);
router.use("/post", blogPostsRouter);

module.exports = router;
