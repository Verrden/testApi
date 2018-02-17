const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('./models/user')
const Post = require('./models/post')
const Note = require('./models/note')
const middleware = require('./middleware/index')

// SECTER
router.get('/hello', middleware.isLoggedIn, (req, res) => {
  res.send('HELLO MESSAGE!')
})

router.get('/', (req, res) => {
  res.sendStatus(200)
})

// SingUp
router.post('/register', (req, res) => {
  const newUser = new User({username: req.body.username})
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      return res.sendStatus(409)
    }
    passport.authenticate('local')(req, res, () => {
      res.sendStatus(200)
    })
  })
})

// SignIn
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.sendStatus(200)
})

// Logout
router.get('/logout', (req, res) => {
  req.logout()
  res.sendStatus(200)
})

// ~~~~~~~~~~~~
// Post routes
// ~~~~~~~~~~~~

router.get('/posts', middleware.isLoggedIn, (req, res) => {
  Post.find({'author.username': req.user.username}, (err, allPosts) => {
    if (err) {
      return res.sendStatus(400)
    }
    res.send(allPosts)
  })
})

router.post('/posts', middleware.isLoggedIn, (req, res) => {
  const newPost = new Post({
    name: req.body.name,
    author: {
      id: req.user._id,
      username: req.user.username
    }
  })

  Post.create(newPost, (err, newOne) => {
    if (err) {
      return res.sendStatus(400)
    }
    res.sendStatus(200)
  })
})

router.get('/posts/:id', middleware.checkPostOwner, (req, res) => {
  Post.findById(req.params.id).populate('notes').exec((err, foundPost) => {
    if (foundPost === null) { return res.sendStatus(402) }
    if (err) {
      return res.sendStatus(400)
    }
    res.send(foundPost)
  })
})

router.put('/posts/:id', middleware.checkPostOwner, (req, res) => {
  Post.findByIdAndUpdate(req.params.id, {name: req.body.name}, (err, updatedPost) => {
    if (err) {
      return res.sendStatus(400)
    }
    res.sendStatus(200)
  })
})

router.delete('/posts/:id', middleware.checkPostOwner, (req, res) => {
  Post.findByIdAndRemove(req.params.id, err => {
    if (err) {
      return res.sendStatus(400)
    }
    res.sendStatus(200)
  })
})

router.post('/posts/search', middleware.isLoggedIn, (req, res) => {
  Post.find({'author.username': req.user.username, name: req.body.name})
  .populate('notes').exec((err, foundPost) => {
    if (foundPost === null || foundPost.length === 0) { return res.sendStatus(404) }
    if (err) {
      return res.sendStatus(400)
    }
    res.send(foundPost)
  })
})

// ~~~~~~~~~~~
// Note routes
// ~~~~~~~~~~~

router.post('/posts/:id/notes', middleware.checkPostOwner, (req, res) => {
  Post.findById(req.params.id, (err, foundPost) => {
    if (err) {
      return res.sendStatus(400)
    }
    const newNote = new Note({
      text: req.body.text,
      author: {
        id: req.user._id,
        username: req.user.username
      }
    })
    Note.create(newNote, (err, note) => {
      if (err) {
        return res.sendStatus(400)
      }
      foundPost.notes.push(note)
      foundPost.save()
      res.sendStatus(200)
    })
  })
})

router.put('/posts/:id/notes/:note_id', middleware.checkPostOwner, (req, res) => {
  Note.findByIdAndUpdate(req.params.note_id, {text: req.body.text}, (err, updatedNote) => {
    if (err) {
      return res.sendStatus(400)
    }
    res.sendStatus(200)
  })
})

router.delete('/posts/:id/notes/:note_id', middleware.checkPostOwner, (req, res) => {
  Note.findByIdAndRemove(req.params.note_id, err => {
    if (err) {
      return res.sendStatus(400)
    }
    res.sendStatus(200)
  })
})

router.get('*', (req, res) => {
  res.sendStatus(404)
})

module.exports = router
