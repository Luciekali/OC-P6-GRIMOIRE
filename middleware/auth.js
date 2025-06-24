const webToken = require('jsonwebtoken');
const { default: httpStatus } = require('http-status');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = webToken.verify(token, process.env.TOKEN_KEY);
        const userId = decodedToken.userId;
        req.auth = { userId };
        next();
    } catch (error) {
        res.status(httpStatus.UNAUTHORIZED).json({ error });
    }
};