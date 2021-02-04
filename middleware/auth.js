const jwt = require('jsonwebtoken');
const jwtMiddleware = (req, res, next) => {
    const jwtToken = req.header('x-auth-token')
    if (!jwtToken) return res.status(401).send('no jwt token');
    try {
        const userPayload = jwt.verify(jwtToken, "jwtsecret1"); // must be an env var
        req.user = userPayload;
        next();
    } catch (e) {
        return res.status(403).send('invalid jwt token');
    }
}
module.exports = jwtMiddleware;

