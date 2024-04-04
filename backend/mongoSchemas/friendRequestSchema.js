const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
    senderID: { type: Number, require: true, unique: true },
    receiverID: { type: Number, require: true, unique: true },
});

const model = mongoose.model("friendRequestModel", friendRequestSchema);

module.exports = model;