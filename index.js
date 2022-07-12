const express = require('express');
const session = require('express-session');
const path = require('path');
var bodyParser = require('body-parser');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy; 
const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
require('dotenv').config();
const cookieSession = require("cookie-session");
const models = require('./models.js');
const User = models.User;

const app = express();

mongoose.connect(process.env.DB_URI, {useUnifiedTopology: true, useNewUrlParser: true}); 

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
        User.findOrCreate({ 
            googleId: profile.id, 
            userName: profile.displayName, 
            email: profile.emails[0].value 
        }, function (err, user) {
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

let userEmail; 

app.get("/auth/google/redirect", passport.authenticate('google'), (req, res) => {
    userEmail = res.req.user.email;
    ensureEmail(); 
    function ensureEmail() {
        if(userEmail !== undefined) {
            res.redirect(path.resolve(__dirname, '/homepage.html'));
        }
        else {
            setTimeout(ensureEmail, 0.25);
        }
    }
});

app.get("/auth/logout", (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session = null; 
        res.redirect('/');
    });
    req.session = null; 
    res.redirect('/');
});

let checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { 
        return next() 
    }
    res.redirect("/");
}

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
app.get('/homepage.html', checkAuthenticated, (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/homepage.html'));
});

app.get('/homepage.css', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/homepage.css'));
});

app.get('/homepage.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/homepage.js'));
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

module.exports = { userEmail }; 