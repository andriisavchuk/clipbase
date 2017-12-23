const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');

// Set express application const
const app = express();

// Load Routes
const clips = require('./routes/clips');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);

// Map global promise
mongoose.Promise = global.Promise;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/clipbase', {
  useMongoClient: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// Parse application/json
app.use(express.json())

// Method-override Middleware
app.use(methodOverride('_method'));

// Express Session Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Fash Middleware
app.use(flash());

// Global Variables for Flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  // Calling next piece of middleware
  next();
});

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome to my NodeJS App';
  res.render('index', {
    title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

// Use Routes
app.use('/clips', clips);
app.use('/users', users);

// Set Port
const port = process.env.port || 3000;

// Listening of the requests
app.listen(port, () => {
  console.log(`Connected to the server on port ${port}`);
});
