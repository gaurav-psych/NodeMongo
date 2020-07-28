var express = require("express");
var router = express.Router();
var ObjectID = require("mongodb").ObjectID;
const sha256 = require("js-sha256").sha256;
const secretKeyN = require("../config/secret").secretKey;

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
  const password = req.body.password;
  const hashPass = sha256.hmac(secretKeyN, password);

  let userDetails = new UserModel({
    name: req.body.name,
    age: req.body.age,
    password: hashPass
  });
  // userDetails.name = req.name;
  // userDetails.age = req.age;

  console.log(userDetails, "newuser");

  const doesUserExist = await UserModel.exists({ name: req.body.name });
  console.log(doesUserExist, " does user");
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

router.post("/login", async (req, res) => {
  const password = req.body.password;
  const hashPass = sha256.hmac(secretKeyN, password);

  const doesUserExist = await UserModel.exists({
    name: req.body.name,
    password: hashPass
  });

  if (doesUserExist) {
    res.json({ error: "Login successfull" });
  } else {
    res.json({ error: "User doesnt exist" });
  }
});

router.get("/updateExistingUsersWithPassword", async (req, res) => {
  let resultOfUpdate = await UserModel.update(
    { password: { $exists: false } },
    { $set: { password: "password nai hai" } }
  );

  console.log(resultOfUpdate, "result of update for pass");
});

module.exports = router;
