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

const UpdateUserSchema = new mongoose.Schema();

UpdateUserSchema.add(UserSchema).add({
  password: {
    type: String
  }
});

mongoose.model("Users", UpdateUserSchema);
