const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// Set up express application const
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

// Set up Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Parse application/json
app.use(bodyParser.json())

// Set up Index Route
app.get('/', (req, res) => {
  const title = 'Welcome to my NodeJS App';
  res.render('index', {
    title
  });
});

// Set up About Route
app.get('/about', (req, res) => {
  res.render('about');
});

// Set up Clip Form
app.get('/clips/add', (req, res) => {
  res.render('clips/add');
});

//Process Form
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
        res.redirect('/clips');
      })
  }
});

// Set up port
const port = process.env.port || 3000;

// Listening of the requests
app.listen(port, () => {
  console.log(`Connected to the server on port ${port}`);
});
