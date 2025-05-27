const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middlewares généreaux

//    * body-parser
app.use(express.json());

//    * CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Connexion mongoose : app & base de données MongoDBAtlas
mongoose.connect('mongodb+srv://luciekalinowski:hmFccJye3vTJ8HrD@cluster0.qkvewoo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const Book = require('./models/book');
const User = require('./models/user');

// Export de l'app Express
module.exports = app;