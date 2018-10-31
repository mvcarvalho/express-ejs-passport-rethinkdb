const passport = require('passport');
const { Strategy } = require('passport-local');
const r = require('rethinkdb');
const dbConf = require('../db');

module.exports = function LocalStrategy() {
  passport.use(new Strategy({
    usernameField: 'username',
    passwordField: 'password'
  }, async (username, password, done) => {
    const connection = await r.connect(dbConf);
    const response = await r.table('users').filter(r.row('username').eq(username)).run(connection);
    const users = await response.toArray();
    await connection.close();

    if (!users || users.length <= 0) { return done(null, false); }

    const user = users[0];
    if (user.password != password) { return done(null, false); }

    done(null, user);
  }));
};
