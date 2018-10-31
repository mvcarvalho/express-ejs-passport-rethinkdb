const passport = require('passport');
const r = require('rethinkdb');
require('./strategies/local')();

const dbConf = require('../configs/db');

module.exports = function passportConfig(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (userId, done) => {
    const connection = await r.connect(dbConf);
    const user = await r.table('users').get(userId).run(connection);
    await connection.close();
    done(null, user);
  });
};
