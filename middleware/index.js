const Post = require('../models/post');

const middlewareObj = {}

middlewareObj.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) return next();
  res.sendStatus(400);
}

middlewareObj.checkPostOwner = (req, res, next) => {
  if(req.isAuthenticated()){
    Post.findById(req.params.id, (err, foundPost) => {
      if(err){
        console.log(err);
        return res.sendStatus(400);
      }
      if(foundPost.author.id.equals(req.user._id)) return next();
      res.sendStatus(400);
    })
  } else {
    res.sendStatus(400);
  }
}

module.exports = middlewareObj;
