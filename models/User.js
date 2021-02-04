const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken')
const Joi = require('joi');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 4,
        maxlength: 255,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minlength: 4,
        maxlength: 255,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdPostsId: {
        type: [String],
        default: []
    },
    likedPostsId: {
        type: [String],
        default: []
    }
});

userSchema.methods.generateJwt = function () {
    let token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

const validateUser = (user) => {
    const schema = Joi.object({
        username: Joi.string().min(4).max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(255).required(),
        idAdmin: Joi.boolean()
    });
    return schema.validate(user);
}

const User = mongoose.model("User", userSchema);
module.exports.User = User;
module.exports.validateUser = validateUser;
