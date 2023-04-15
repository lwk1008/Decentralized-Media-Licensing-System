var mongoose = require('mongoose');

var loginSchema = new mongoose.Schema(
    {
      publicKey: String,
      nonce: String
    });

module.exports = mongoose.model("login", loginSchema);