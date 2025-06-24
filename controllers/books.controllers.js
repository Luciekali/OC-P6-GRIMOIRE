const Book = require('../models/book');
const { default: httpStatus } = require('http-status');
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(httpStatus.OK).json(books))
        .catch(error => res.status(httpStatus.BAD_REQUEST).json({ error }))
};

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._userId; // securité : prendre données du token d'auth plutot que du client 

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`  // url pour acceder au fichier 
    });

    book.save()
        .then(() => res.status(httpStatus.CREATED).json({ message: 'Livre créé !' }))
        .catch((error) => {               // Capture erreur en cas de doublon dans titre du livre
            const filename = book.imageUrl.split('/images/')[1];   //suppression de l'img du fs
            fs.unlink(`images/${filename}`, () => {
                if (error.httpStatus === 11000) {
                    res.status(httpStatus.CONFLICT).json({ message: 'Le livre existe déjà.' });
                }
                else if (error.name === 'ValidationError') {
                    res.status(httpStatus.CONFLICT).json({ message: 'Le livre existe déjà.' });
                }
                else {
                    res.status(httpStatus.BAD_REQUEST).json({ error });
                }
            })
        })
}

exports.getOneBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(httpStatus.OK).json(book))
        .catch(error => res.status(httpStatus.BAD_REQUEST).json({ error }));
}

exports.modifyBook = (req, res) => {
    // creer le new url si file
    // //modif
    // supprime l'img du fs nouveau ou ancien selon reussite ou echec 

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(httpStatus.UNAUTHORIZED).json({ error });
            }

            const oldFileName = book.imageUrl.split('/images/')[1]
            let newFileName = null

            const bookObject = req.file ?
                { // si il y a img, genere l'url
                    ...JSON.parse(req.body.book),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                } : { ...req.body };

            if (req.file) {
                newFileName = req.file.filename;
            }

            delete bookObject._userId;
            //delete bookObject._id;

            Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                .then(() => {
                    if (newFileName) {
                        fs.unlink(`images/${oldFileName}`, error => {
                            if (error) {
                                console.error("Erreur lors de la suppression de l'ancienne image :", error);
                            }
                        });
                    }

                    res.status(httpStatus.OK).json({ message: 'Livre modifié' });
                })
                .catch(error => {
                    if (newFileName) {
                        fs.unlink(`images/${newFileName}`, error => {
                            if (error) {
                                console.error("Erreur lors de la suppression de la nouvelle image :", error);
                            }
                        });
                    }

                    res.status(httpStatus.BAD_REQUEST).json({ error });
                });
        })
};

exports.addRating = (req, res) => {
    // cherche livre et verifie que l'user n'ait pas déjà évalué le livre 
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(httpStatus.NOT_FOUND).json({ message: 'Livre non trouvé' });
            }
            const allreadyRated = book.ratings.find(r => r.userId === req.auth.userId);

            if (allreadyRated) {
                return res.status(httpStatus.CONFLICT).json({ message: 'livre déjà évalué' })
            }

            //ajoute la note + son user et met a jour la moyenne si reussite
            const updateAverage = req.averageRating;

            Book.findByIdAndUpdate(req.params.id,
                {
                    $push: { ratings: { userId: req.auth.userId, grade: req.body.grade } },
                    $set: { averageRating: updateAverage }
                },
                { new: true }
            )
                .then((updatedBook) => res.status(httpStatus.OK).json(updatedBook))
                .catch(error => res.status(httpStatus.BAD_REQUEST).json({ error }));

        })
        .catch(error => res.status(httpStatus.BAD_REQUEST).json({ error }));
};

exports.deleteBook = (req, res) => {

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(httpStatus.NOT_FOUND).json({ message: 'Livre non trouvé' });
            }

            if (book.userId != req.auth.userId) {
                return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Non authorisé' });
            }
            const filename = book.imageUrl.split('/images/')[1];  // Recuperer le nom du fichier à suppr
            //suppression fichier 
            Book.deleteOne({ _id: req.params.id })
                .then(() => {
                    fs.unlink(`images/${filename}`, error => {
                        if (error) {
                            console.error("Erreur lors de la suppression de l'image :", error);
                        }
                    });
                    res.status(httpStatus.OK).json({ message: 'livre supprimé' });
                })
                .catch(error => res.status(httpStatus.BAD_REQUEST).json({ error }));

        })
        .catch(error => res.status(httpStatus.BAD_REQUEST).json({ error }));
}

exports.getBestRating = (req, res) => {
    const books = Book.find()

        .then((books) => {
            const sortRatings = books.sort((a, b) => a.averageRating - b.averageRating) // ordre decroissant
            const bestRatingBooks = sortRatings.splice(2).reverse() // trois books croissants

            res.status(httpStatus.OK).json(bestRatingBooks)
        })

        .catch((error) => {
            res.status(httpStatus.BAD_REQUEST).json({ error })
        });
}


