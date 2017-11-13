const express = require('express');
const exphbs = require('express-handlebars');
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

// Set up port
const port = process.env.port || 3000;

// Listening of the requests
app.listen(port, () => {
  console.log(`Connected to the server on port ${port}`);
});
