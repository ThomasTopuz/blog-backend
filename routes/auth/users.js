const express = require('express');
const router = express.Router();
const {User, validateUser} = require('../../models/User');
const bcrypt = require('bcrypt');
const _ = require('lodash');


router.post("/login", async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    if (!user) return res.status(400).send('invalid email of password');
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('invalid email of password');
    let token = user.generateJwt();
    res.header('x-auth-token', token).status(200).send(_.pick(user, ["_id", "username", "email", "isAdmin"]));
});

router.post('/register', (async (req, res) => {
    let user = await User.findOne({email: req.body.email});

    if (user) return res.status(400).send('user already registered');

    const error = validateUser(req.body);
    if(error.error) return res.status(400).send(error.error.details[0].message);
    user = new User(_.pick(req.body, ['username', 'email', 'password']))
    user.isAdmin = false
    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt(10))

    user = await user.save()
    const token = user.generateJwt()
    return res.header("x-auth-token", token).status(200).send(_.pick(user, ['_id', 'username', 'email', "isAdmin"]));
}));

//me


module.exports = router;
