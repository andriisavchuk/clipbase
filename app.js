const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// Set express application const
const app = express();

// Map global promise
mongoose.Promise = global.Promise;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/clipbase', {
  useMongoClient: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Load Clip Model
require('./models/Clip');
const Clip = mongoose.model('clips');

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Parse application/json
app.use(bodyParser.json())

// Method-override Middleware
app.use(methodOverride('_method'));

// Express Session Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Fash Middleware
app.use(flash());

// Global Variables for Flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  // Calling next piece of middleware
  next();
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome to my NodeJS App';
  res.render('index', {
    title
  });
});

// Clip Form
app.get('/clips/add', (req, res) => {
  res.render('clips/add');
});

// Edit Clip Form
app.get('/clips/edit/:id', (req, res) => {
  Clip.findOne({
    _id: req.params.id
  })
  .then(clip => {
    res.render('clips/edit', {
      clip
    })
  });
});

// Clip Route
app.get('/clips', (req, res) => {
  Clip.find({})
    .sort({date: 'desc'})
    .then(clips => {
      res.render('clips/index', {
        clips
      });
    })
});

// Process Form
app.post('/clips', (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!req.body.description) {
    errors.push({ text: 'Please add some description' });
  }
  if (!req.body.style) {
    errors.push({ text: 'Please add style of the clip' });
  }
  if (!req.body.director) {
    errors.push({ text: 'Please add directors Name' });
  }
  if (!req.body.duration) {
    errors.push({ text: 'Please add desired duration of the clip' });
  }

  if (errors.length > 0) {
    res.render('clips/add', {
      errors: errors,
      title: req.body.title,
      description: req.body.description,
      style: req.body.style,
      director: req.body.director,
      duration: req.body.duration
    });
  } else {
    // Add data to database
    const newClip = {
      title: req.body.title,
      description: req.body.description,
      style: req.body.style,
      director: req.body.director,
      duration: req.body.duration
    }
    new Clip(newClip)
      .save()
      .then(clip => {
        req.flash('success_msg', 'Clip information added');
        res.redirect('/clips');
      })
  }
});

// Edit form process
app.put('/clips/:id', (req, res) => {
  Clip.findOne({
    _id: req.params.id
  })
  .then(clip => {
    // adding new values
    clip.title = req.body.title;
    clip.description = req.body.description;
    clip.style = req.body.style;
    clip.director = req.body.director;
    clip.duration = req.body.duration;

    clip.save()
      .then(clip => {
        req.flash('success_msg', 'Clip information updated');
        res.redirect('/clips');
      })
  });
});

// Delete Clip
app.delete('/clips/:id', (req, res) => {
  Clip.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Clip information removed');
      res.redirect('/clips');
    });
});

// User Login Route
app.get('/users/login', (req, res) => {
  res.send('Login');
});

// User Registration Route
app.get('/users/registration', (req, res) => {
  res.send('Registration');
});

// Set Port
const port = process.env.port || 3000;

// Listening of the requests
app.listen(port, () => {
  console.log(`Connected to the server on port ${port}`);
});
