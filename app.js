const express = require('express');
const exphbs = require('express-handlebars');


// Set up express application const
const app = express();

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

// Set up port
const port = process.env.port || 3000;

// Listening of the requests
app.listen(port, () => {
  console.log(`Connected to the server on port ${port}`);
});
