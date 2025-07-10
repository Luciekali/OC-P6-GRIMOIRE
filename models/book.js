const mongoose = require('mongoose');
const User = require('./user')

const uniqueValidator = require('mongoose-unique-validator');

const bookSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, unique: true, required: [true, 'Le titre est requis'], trim: true },
    author: { type: String, required: [true, "L'auteur est requis"], trim: true },
    imageUrl: { type: String },
    year: { type: Number, required: [true, "L'année est requise"], trim: true },
    genre: { type: String, required: [true, "Le genre est requis"], trim: true },

    ratings: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
            grade: { type: Number, min: 0, max: 5, },

        }
    ],// - notes données à un livre
    averageRating: { type: Number, default: 0 }, // note moyenne du livre
})

bookSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Book', bookSchema);