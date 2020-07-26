var express = require("express");
var router = express.Router();
var ObjectID = require("mongodb").ObjectID;

const mongoose = require("mongoose");

let UserModel = mongoose.model("Users");

/* GET Users page. */
router.get("/", (req, res, next) => {
  UserModel.find((err, docs) => {
    if (!err) {
      res.json({ "COurses found": 3 });
    } else {
      res.send("Error COurses");
    }
  });
});

router.post("/addUser", async (req, res) => {
  let userDetails = new UserModel({
    name: req.body.name,
    age: req.body.age
  });
  // userDetails.name = req.name;
  // userDetails.age = req.age;

  const doesUserExist = UserModel.exists({ name: req.body.name });

  if (doesUserExist) {
    res.json({ error: "User already exists" });
  } else {
    userDetails.save((err, doc) => {
      if (err) {
        res.json({ error: err });
      } else {
        res.json({ success: true, message: "User Added" });
      }
    });
  }
});

module.exports = router;
