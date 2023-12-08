const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  storeName:String,
  username: String,
  email:String,
  profilePicture:String,
  isAdmin:Boolean,
  password: String,
});

const User = mongoose.model('users', userSchema);

module.exports = User;