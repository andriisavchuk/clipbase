const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema declaration
const ClipSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  style:{
    type: String,
    required: true
  },
  director:{
    type: String,
    required: true
  },
  duration:{
    type: Number,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('clips', ClipSchema);
