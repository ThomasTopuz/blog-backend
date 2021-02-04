const mongoose = require('mongoose');
const Joi = require('joi');

const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        maxLength: 254,
        minlength: 1,
        required: true
    },
    content: {
        type: String,
        maxLength: 2000,
        minlength: 10,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    votes: {
        type: Number,
        default: 0

    },
    userId: {
        type: String,
        required: true
    }
});
const validatePost = (blogPost) => {
    const schema = Joi.object({
        title: Joi.string().min(1).max(254).required(),
        content: Joi.string().min(10).max(2000).required(),
        date: Joi.date(),
        votes: Joi.number().min(0),
        userId: Joi.string()
    });
    return schema.validate(blogPost);
}

const Post = mongoose.model("Post", blogPostSchema);
module.exports.validatePost = validatePost;
module.exports.Post = Post;
