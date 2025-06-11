const Book = require('../models/book');
const { default: code } = require('http-status');

exports.getAllBooks = (req, res) => {
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
        .catch(error => res.status(code.BAD_REQUEST).json({ error }));
}

exports.getOneBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(code.OK).json(book))
        .catch(error => res.status(code.BAD_REQUEST).json({ error }));
}

