const mongoose = require("mongoose");

// Store account details and app preferences.
const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  age: String,
  favSport: String,
  avatar: String,
});

module.exports = mongoose.model("User", UserSchema);
