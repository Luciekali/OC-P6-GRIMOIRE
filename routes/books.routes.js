const express = require('express');
const router = express.Router();

const booksCtrl = require('../controllers/books.controllers');

router.get('/', booksCtrl.getAllBooks);
router.post('/', booksCtrl.createBook);

router.get('/:id', booksCtrl.getOneBook);


module.exports = router;