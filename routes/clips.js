const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load Clip Model
require('../models/Clip');
const Clip = mongoose.model('clips');

// Clip Index Route
router.get('/', ensureAuthenticated, (req, res) => {
  Clip.find({user: req.user.id})
    .sort({date: 'desc'})
    .then(clips => {
      res.render('clips/index', {
        clips
      });
    })
});

// Add Clip Form
router.get('/add', ensureAuthenticated,  (req, res) => {
  res.render('clips/add');
});

// Edit Clip Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Clip.findOne({
    _id: req.params.id
  })
  .then(clip => {
    if (clip.user != req.user.id) {
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/clips');
    } else {
      res.render('clips/edit', {
        clip: clip
      });
    }
  });
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
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
      duration: req.body.duration,
      user: req.user.id
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
router.put('/:id', ensureAuthenticated, (req, res) => {
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
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Clip.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Clip information removed');
      res.redirect('/clips');
    });
});

module.exports = router;
