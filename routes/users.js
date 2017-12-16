const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User Registration Route
router.get('/registration', (req, res) => {
  res.render('users/registration');
});

// Registration Form POST
router.post('/registration', (req, res) => {
  let errors = [];

  if (req.body.password) {

  }
});

module.exports = router;
