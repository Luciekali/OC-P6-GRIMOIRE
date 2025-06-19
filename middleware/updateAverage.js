const Book = require('../models/book');
const calculateAverage = require('../utils/calculateAverage');
const { default: code } = require('http-status');

// recupere nouvelle note et l'inclus dans le tableau avec les anciennes et calcule moy
module.exports = (req, res, next) => {
    const book = Book.findOne({ _id: req.params.id })

        .then(book => {
            const newGrade = req.body.rating
            const grades = book.ratings.map(rating => rating.grade)
            grades.push(newGrade)

            const average = calculateAverage(grades)
            req.averageRating = average         // faire la mise a jour de la moy dans le controller au cas ou beug de l'ajout de la nouvelle note
            next()
        })
        .catch(error => res.status(code.BAD_REQUEST).json({ error }));
}
