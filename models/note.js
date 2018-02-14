const mongoose = require('mongoose'),
      Schema = mongoose.Schema

const noteSchema = new Schema({
  text: String,
  author:{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }
})

module.exports = mongoose.model('Note', noteSchema);
