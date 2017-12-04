const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// User Login Route
router.get('/login', (req, res) => {
  res.send('Login');
});

// User Registration Route
router.get('/registration', (req, res) => {
  res.send('Registration');
});

module.exports = router;
