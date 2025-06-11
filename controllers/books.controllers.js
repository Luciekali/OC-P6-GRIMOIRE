const Book = require('../models/book');
const { default: code } = require('http-status');

exports.getAllBooks = (req, res) => {
    Book.find()
        .then(books => res.status(code.OK).json(books))
        .catch(error => res.status(code.BAD_REQUEST).json({ error }))
};

exports.createBook = (req, res, next) => {
    const book = new Book({
        ...req.body
    });                  // creation book avec données du body
    book.save()
        .then(() => res.status(code.CREATED).json({ message: 'Livre créé !' }))
        .catch(error => res.status(code.BAD_REQUEST).json({ error }));
}

exports.getOneBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(code.OK).json(book))
        .catch(error => res.status(code.BAD_REQUEST).json({ error }));
}

