const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// User Login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User Registration Route
router.get('/registration', (req, res) => {
  res.render('users/registration');
});

// Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/clips',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Registration Form POST
router.post('/registration', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({text: 'Passwords do not match'});
  }

  if (req.body.password.length < 4) {
    errors.push({text: 'Password must be at least 4 characters'});
  }

  if (errors.length > 0) {
    res.render('users/registration', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({email: req.body.email})
    .then(user => {
      if (user) {
        req.flash('error_msg', 'User with such email is already registered.');
        res.redirect('/users/registration');
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
            .then(user => {
              req.flash('success_msg', 'You are now registered. Please log in.');
              res.redirect('/users/login');
            })
            .catch(err => {
              console.log(err);
              return;
            });
          });
        });
      }
    });
  }
});

module.exports = router;

