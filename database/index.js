const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/GauravPersonal", {
  useNewUrlParser: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  // we're connected!
  console.log("Yass DB connected");
});

const Users = require("./users.model");
