const r = require('rethinkdb');
const debug = require('debug')('app:controller:book');

const dbConf = require('../configs/db');

module.exports = function Controller(nav, goodreadsService) {
  this.authMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) next();
    else res.redirect('/');
  };

  this.getBooks = async (req, res) => {
    const connection = await r.connect(dbConf);
    const result = await r.table('books').run(connection);
    await connection.close();

    const books = await result.toArray();

    res.render('book-list-view', {
      title: 'Books',
      nav,
      books
    });
  };

  this.getBookById = async (req, res) => {
    const { id } = req.params;
    const connection = await r.connect(dbConf);
    const book = await r.table('books').get(id).run(connection);
    await connection.close();

    book.details = await goodreadsService.getBookById(50);
    debug(book.details);

    res.render('book-view', {
      title: 'Book',
      nav,
      book
    });
  };
};
