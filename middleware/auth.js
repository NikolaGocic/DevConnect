const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {

    const token = req.header("x-auth-token");

    if (!token) {
        return res.status(401).json({ msg: 'No token, auth denied' });
    }

    try {
        const decode = jwt.verify(token, config.get('jwt'));
        req.user = decode.user;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: 'Token not valid, auth denied' });
    }

    
}