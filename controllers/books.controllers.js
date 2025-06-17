const Book = require('../models/book');
const { default: code } = require('http-status');

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(code.OK).json(books))
        .catch(error => res.status(code.BAD_REQUEST).json({ error }))
};

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._userId;             // securité : prendre données du token d'auth plutot que du client 
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`  // url pour acceder au fichier 
    });

    book.save()
        .then(() => res.status(code.CREATED).json({ message: 'Livre créé !' }))
        .catch((error) => {               // Capture erreur en cas de doublon dans titre du livre
            if (error.code === 11000) {
                res.status(code.CONFLICT).json({ message: 'Le livre existe déjà.' });
            }
            else if (error.name === 'ValidationError') {
                res.status(code.CONFLICT).json({ message: 'Le livre existe déjà.' });
            }
            else {
                res.status(code.BAD_REQUEST).json({ error });
            }
        })
}

exports.getOneBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(code.OK).json(book))
        .catch(error => res.status(code.BAD_REQUEST).json({ error }));
}

exports.modifyBook = (req, res) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(code.UNAUTHORIZED);
            }
            else {
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(code.OK).json({ message: 'livre modifié' }))
                    .catch(error => res.status(code.BAD_REQUEST).json({ error }))
            }
        })
        .catch(error => res.status(code.BAD_REQUEST).json({ error }));
};

