const Book = require('../models/book');

exports.getAllBooks = (req, res) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }))
};

exports.createBook = (req, res, next) => {
    const book = new Book({
        ...req.body
    });                  // creation book avec données du body
    book.save()
        .then(() => res.status(201).json({ message: 'Livre créé !' }))
        .catch(error => res.status(400).json({ error }));
}

exports.getOneBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }));
}

