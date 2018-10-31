const express = require('express');
const BookController = require('../controllers/book-controller');
const GoodreadsService = require('../services/goodreads-service');

module.exports = function Router(nav) {
  const bookRouter = express.Router();
  const goodreadsService = new GoodreadsService();
  const bookController = new BookController(nav, goodreadsService);

  bookRouter.use(bookController.authMiddleware);

  bookRouter.route('/')
    .get(bookController.getBooks);

  bookRouter.route('/:id')
    .get(bookController.getBookById);

  return bookRouter;
};
