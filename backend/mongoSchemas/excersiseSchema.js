const mongoose = require('mongoose');

const excersiseSchema = new mongoose.Schema({
    excersiseID: { type: Number, require: true, unique: true },
    title: { type: String, require: true, unique: true },
    desc: { type: String, require: true, unique: false },
    type: { type: String, require: true, unique: false },
    equipment: { type: String, require: true, unique: false },
    visibility: { type: String, require: true, unique: false },
    videoType: {type: String, require: true, unique: false},
    videoTimeStamp: {type: Number, require: true, unique: false},
    videoLink: {type: String, require: true, unique: false},
});

const model = mongoose.model("ExcersiseModel", excersiseSchema);

module.exports = model;