const express = require('express');


// Set up axpress application const
const app = express();

// Set up port
const port = process.env.port || 3000;

// Listening of the requests
app.listen(port, () => {
  console.log(`Connected to the server on port ${port}`);
});
