const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Required"
  },
  age: {
    type: Number,
    required: "Required"
  }
});

mongoose.model("Users", UserSchema);
