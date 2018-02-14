const express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
      passport = require('passport'),
      localStrategy =  require('passport-local').Strategy,
      config = require('./config/main'),
      User = require('./models/user'),
      apiRoutes = require('./router')

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(require("express-session")({
    secret: "blah blah secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log("Kek");
});

app.use('/api', apiRoutes);

app.listen(config.port, () => {
  console.log('Server listening on port ' + config.port);
})
