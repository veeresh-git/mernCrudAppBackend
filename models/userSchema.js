const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    // profileimage: {
    //     type: String,
    //     required: true
    // },
});

const users = new mongoose.model("users",userSchema);


module.exports = users;