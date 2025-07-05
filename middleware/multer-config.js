const multer = require('multer'); // permet le stockage du fichier

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')                              // mettre dans le dossier images en local
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');  // remplacer les espaces par _
        const extension = MIME_TYPES[file.mimetype];          // traduit le type MIME 
        callback(null, name + Date.now() + '.' + extension)
    }
});

module.exports = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 } // taille maximum 2Mo
}).single('image');