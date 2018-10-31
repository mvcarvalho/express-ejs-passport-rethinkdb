const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'library' }));

require('./src/configs/passport')(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/fonts', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/fonts')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd')));

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

const nav = [{
  name: 'Books',
  url: '/books'
}, {
  name: 'Authors',
  url: '/authors'
}];

app.use('/books', require('./src/routes/book-routes')(nav));
app.use('/admin', require('./src/routes/admin-routes')(nav));
app.use('/auth', require('./src/routes/auth-routes')(nav));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Library',
    nav
  });
});

app.listen(3000, (err) => {
  if (err) return debug(chalk.red(err));
  return debug(`listening at port ${chalk.green('3000')}`);
});
