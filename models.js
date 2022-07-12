const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new mongoose.Schema({
    googleId: String, 
    userName: String,
    email: String,
});

userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema); 

module.exports = { User }