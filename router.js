const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      User = require('./models/user'),
      Post = require('./models/post'),
      Note = require('./models/note'),
      middleware = require('./middleware/index')

//SECTER
router.get('/hello', middleware.isLoggedIn, (req, res) => {
  res.send('HELLO MESSAGE!');
})

router.get('/', (req, res) => {
  res.sendStatus(200);
});

//SingUp
router.post('/register', (req, res) => {
  const newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err) {
      return res.sendStatus(409);
    }
    // passport.authenticate('local')(req, res, () => {
    //   return res.sendStatus(200);
    // })
    res.sendStatus(200);
  })
})

//SignIn
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

//Logout
router.get('/logout',(req, res) => {
  req.logout();
  res.sendStatus(200);
})

//~~~~~~~~~~~~
//Post routes
//~~~~~~~~~~~~
router.get('/posts', middleware.isLoggedIn, (req, res) => {
  Post.find({}, (err, allPosts) => {
    if(err) {
      console.log(err);
      return res.sendStatus(400);
    }
    res.send(allPosts);
  })
})

router.post('/posts', middleware.isLoggedIn, (req, res) => {
  const newPost = new Post({
    name: req.body.name,
    author: {
      id: req.user._id,
      username: req.user.username
    }
  });

  Post.create(newPost, (err, newOne) => {
    if(err) {
      console.log(err);
      return res.sendStatus(400);
    }
    console.log(newOne);
    res.sendStatus(200);
  })
})

router.get('/posts/:id', middleware.checkPostOwner, (req, res) => {
  Post.findById(req.params.id).populate('notes').exec((err, foundPost) => {
    if(err){
      console.log(err);
      return res.sendStatus(400);
    }
    console.log(foundPost);
    res.send(foundPost);
  })
})

router.put('/posts/:id', middleware.checkPostOwner, (req, res) => {
  Post.findByIdAndUpdate(req.params.id, {name: req.body.name}, (err, updatedPost) => {
    if(err){
      console.log(err);
      return res.sendStatus(400);
    }
    console.log(updatedPost);
    res.sendStatus(200);
  })
})

router.delete('/posts/:id', middleware.checkPostOwner, (req, res) => {
  Post.findByIdAndRemove(req.params.id, err => {
    if(err){
      console.log(err);
      return res.sendStatus(400);
    }
    res.sendStatus(200);
  })
})

//~~~~~~~~~~~
//Note routes
//~~~~~~~~~~~

router.post('/posts/:id/notes', middleware.checkPostOwner, (req, res) => {
  Post.findById(req.params.id, (err, foundPost) => {
    if(err) {
      console.log(err);
      return res.sendStatus(400);
    }
    const newNote = new Note({
      text: req.body.text,
      author: {
        id: req.user._id,
        username: req.user.username
      }
    })
    Note.create(newNote, (err, note) => {
      if(err) {
        console.log(err);
        return res.sendStatus(400);
      }
      foundPost.notes.push(note);
      foundPost.save();
      console.log(foundPost);
      res.sendStatus(200);
    })
  })
})

router.put('/posts/:id/notes/:note_id', middleware.checkPostOwner, (req, res) => {
  Note.findByIdAndUpdate(req.params.note_id, {text: req.body.text}, (err, updatedNote) => {
    if(err) {
      console.log(err);
      return res.sendStatus(400);
    }
    res.sendStatus(200);
  })
})

router.delete('/posts/:id/notes/:note_id', middleware.checkPostOwner, (req, res) => {
  Note.findByIdAndRemove(req.params.note_id, err => {
    if(err) {
      console.log(err);
      return res.sendStatus(400);
    }
    res.sendStatus(200);
  })
})

router.get('*', (req, res) => {
  res.sendStatus(200);
})

module.exports = router;