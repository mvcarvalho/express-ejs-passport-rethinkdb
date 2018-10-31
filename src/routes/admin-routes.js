const express = require('express');
const r = require('rethinkdb');
const dbConf = require('../configs/db');

const books = [
  {
    title: 'Jeremy Book',
    author: 'Veronica Zhang',
    read: true
  },
  {
    title: 'Judith Book',
    author: 'Louis Scarborough',
    read: true
  },
  {
    title: 'Ann Book',
    author: 'Max Perkins',
    read: false
  },
  {
    title: 'Leah Book',
    author: 'Tim McKenzie',
    read: false
  },
  {
    title: 'Julian Book',
    author: 'Randy Hull',
    read: true
  },
  {
    title: 'Hilda Book',
    author: 'Allan Nixon',
    read: false
  },
  {
    title: 'Lois Book',
    author: 'Bill Davis',
    read: true
  }
];

module.exports = function Router(nav) {
  const adminRouter = express.Router();

  adminRouter.route('/reset').get(async (req, res) => {
    const conf = {
      host: dbConf.host,
      port: dbConf.port
    };
    const dbName = dbConf.db;

    try {
      const connection = await r.connect(conf);

      const dbs = await r.dbList().run(connection);
      if (dbs.indexOf(dbName) > -1) { await r.dbDrop(dbName).run(connection); }

      await r.dbCreate(dbName).run(connection);
      await r.db(dbName).tableCreate('books').run(connection);
      await r.db(dbName).tableCreate('users').run(connection);
      await r.db(dbName).table('books').insert(books).run(connection);
      await connection.close();
      res.json('Database Reseted.');
    } catch (error) {
      res.status(500).json(error);
    }
  });

  return adminRouter;
};
