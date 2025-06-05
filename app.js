require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// routes 
const booksRoutes = require('./routes/books.routes');
const usersRoutes = require('./routes/users.routes');

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
mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('/api/books', booksRoutes);
app.use('/api/auth', usersRoutes)

// Export de l'app Express
module.exports = app;