const httpStatus = require('http-status');

module.exports = (error, req, res, next) => {
    if (error.name === 'MulterError') {

        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Fichier trop volumineux. Taille maximale autorisée : 2 Mo.',
            });
        }
    }
    next(error)
}