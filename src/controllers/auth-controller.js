const passport = require('passport');
const r = require('rethinkdb');
const dbConf = require('../configs/db');

module.exports = function Controller(nav) {
  this.postSignUp = async (req, res) => {
    const { username, password } = req.body;
    const connection = await r.connect(dbConf);
    const response = await r.table('users').insert({ username, password }).run(connection);
    const user = await r.table('users').get(response.generated_keys[0]).run(connection);
    await connection.close();
    req.login(user, () => {
      res.redirect('/books');
    });
  };

  this.getSignIn = (req, res) => {
    res.render('sign-in', {
      nav,
      title: 'Sign In'
    });
  };

  this.postSignIn = passport.authenticate('local', {
    successRedirect: '/books',
    failureRedirect: '/'
  });

  this.authProfileMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) next();
    else res.redirect('/');
  };

  this.getProfile = (req, res) => {
    res.json(req.user);
  };
};
