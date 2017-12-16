const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema declaration
const UserSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  timestamps: true
});

mongoose.model('users', UserSchema);
