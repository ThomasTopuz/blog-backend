const jwt = require('jsonwebtoken');
const config = require('config');


const jwtMiddleware = (req, res, next) => {
    const jwtToken = req.header('x-auth-token')
    if (!jwtToken) return res.status(401).send('no jwt token');
    try {
        const userPayload = jwt.verify(jwtToken, config.get('jwtPrivateKey')); // must be an env var
        req.user = userPayload;
        next();
    } catch (e) {
        return res.status(403).send('invalid jwt token');
    }
}
module.exports = jwtMiddleware;

