const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userID: { type: Number, require: true, unique: true },
    username: { type: String, require: true, unique: true },
    mail: { type: String, require: true, unique: false },
    password: { type: String, require: true, unique: false },
    friends: { type: [String], require: true, unique: false },
});

const model = mongoose.model("UserModel", userSchema);

module.exports = model;