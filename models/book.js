const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    userId: { type: String }, // identifiant MongoDB unique de l'utilisateur qui a créé le livre
    title: { type: String }, // titre du livre
    author: { type: String }, // auteur du livre
    imageUrl: { type: String }, // illustration / couverture du livre
    year: { type: Number }, // année de publication du livre
    genre: { type: String }, //genre du livre

    ratings: [
        {
            userId: { type: String }, // identifiant MongoDB unique de l'utilisateur qui a noté le livre
            grade: { type: Number }, // note donnée à un livre 

        }
    ],// - notes données à un livre
    averageRating: { type: Number }, // note moyenne du livre
})

module.exports = mongoose.model('Book', bookSchema);