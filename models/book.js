const mongoose = require('mongoose');
const User = require('./user')

const uniqueValidator = require('mongoose-unique-validator');

const bookSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, unique: true },
    author: { type: String },
    imageUrl: { type: String },
    year: { type: Number },
    genre: { type: String },

    ratings: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
            grade: { type: Number, min: 0, max: 5, },

        }
    ],// - notes données à un livre
    averageRating: { type: Number, default: 0 }, // note moyenne du livre
})

bookSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Book', bookSchema);