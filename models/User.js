const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  secretData: { type: String }, // data terenkripsi
});

module.exports = mongoose.model('User', userSchema);
