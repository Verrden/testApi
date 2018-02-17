const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
  name: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
})

module.exports = mongoose.model('Post', postSchema)
