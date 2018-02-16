const mongoose = require('mongoose'),
      passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    // required: true
  }
})

 userSchema.plugin(passportLocalMongoose);

 module.exports = mongoose.model('User', userSchema);
