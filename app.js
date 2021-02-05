const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('config');

const usersRouter = require('./routes/auth/users');
const blogPostsRouter = require('./routes/blogPosts/blogPosts');

if (!config.get("jwtPrivateKey")) {
    console.error("jwt privatekey not defined!");
    process.exit(1);
}

app.use(
    cors({
        exposedHeaders: ["x-auth-token"], //returns the x-auth-token
    })
);
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/post', blogPostsRouter);
mongoose
    .connect("mongodb://mongo:27017/blog")
    .then(() => {
        console.log("running");
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(5000, () => console.log("Listening on 5000"))
module.exports = app;
