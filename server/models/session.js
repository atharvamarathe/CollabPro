const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  session_id: Number,
  user_id: Number,
  role: String,
});
const Sessiondb = mongoose.model("session", sessionSchema);

module.exports = { Sessiondb };
