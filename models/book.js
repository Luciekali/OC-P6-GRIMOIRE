const mongoose = require('mongoose');
const User = require('./user')

const bookSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String },
    author: { type: String },
    imageUrl: { type: String },
    year: { type: Number },
    genre: { type: String },

    ratings: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            grade: { type: Number, min: 0, max: 5, },

        }
    ],// - notes données à un livre
    averageRating: { type: Number, default: 0 }, // note moyenne du livre
})

module.exports = mongoose.model('Book', bookSchema);