const webToken = require('jsonwebtoken');
const { default: code } = require('http-status');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = webToken.verify(token, process.env.TOKEN_KEY);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(code.UNAUTHORIZED).json({ error });
    }
};