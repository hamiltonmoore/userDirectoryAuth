const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: String,
    university: String,
    job: {
        type: String,
        default: ''
    },
    avatar: String,
});

let User = mongoose.model("users", userSchema);

module.exports = User;
