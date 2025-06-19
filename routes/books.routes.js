const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const updateAverage = require('../middleware/updateAverage');

const booksCtrl = require('../controllers/books.controllers');


router.get('/', booksCtrl.getAllBooks);
router.post('/', auth, multer, booksCtrl.createBook);
router.get('/:id', booksCtrl.getOneBook);
router.put('/:id', auth, multer, booksCtrl.modifyBook);
router.post('/:id/rating', auth, updateAverage, booksCtrl.addRating);

module.exports = router;