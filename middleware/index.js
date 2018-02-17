const Post = require('../models/post')

const middlewareObj = {}

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  res.sendStatus(400)
}

middlewareObj.checkPostOwner = (req, res, next) => {
  if (req.isAuthenticated()) {
    Post.findById(req.params.id, (err, foundPost) => {
      if (err) {
        return res.sendStatus(400)
      }
      if (foundPost === null) return res.sendStatus(404)
      if (foundPost.author.id.equals(req.user._id)) return next()
      res.sendStatus(403)
    })
  } else {
    res.sendStatus(400)
  }
}

module.exports = middlewareObj
