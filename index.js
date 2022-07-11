const express = require('express');
const session = require('express-session');
const path = require('path');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy; 
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
require('dotenv').config();
const cookieSession = require("cookie-session");

const app = express();

mongoose.connect(process.env.DB_URI, {useUnifiedTopology: true, useNewUrlParser: true}); 

const userSchema = new mongoose.Schema({
    googleId: String, 
    userName: String,
});

userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema); 

// google auth
app.use(cookieSession({
    // milliseconds of a day
    maxAge: 24*60*60*1000,
    keys:[process.env.COOKIE_SECRET]
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/auth/google/redirect"
    },
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ googleId: profile.id, userName: profile.displayName }, function (err, user) {
            return cb(err, user);
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
});

app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"],
    //prompt: 'select_prompt'
}));

app.get("/auth/google/redirect", passport.authenticate('google'), (req, res) => {
    res.redirect(path.resolve(__dirname, '/homepage.html'));
});

app.get("/auth/logout", (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
    req.session = null; 
    res.redirect('/');
});


// login
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/login.html'));
});

app.get('/login.css', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/login.css'));
});

app.get('/login.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/login.js'));
});

app.use('/assets', express.static('./assets'));

// homepage 
app.get('/homepage.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/homepage.html'));
});

app.get('/homepage.css', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/homepage.css'));
});

app.use((err, req, res, next) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: { err: 'An error occurred' }, 
    };
    if (err.error === "Invalid data received"){
      return res.status(400).send(err.error);
    }
    const errorObj = Object.assign(defaultErr, err); 
    return res.status(errorObj.status).send(JSON.stringify(errorObj.message)); 
  });

app.listen(3000, () => console.log('listening on port: 3000'));