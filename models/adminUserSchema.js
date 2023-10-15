const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
});

const adminUsers = new mongoose.model("adminUsers", adminUserSchema);

module.exports = adminUsers;
