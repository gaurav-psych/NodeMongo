var express = require("express");
var router = express.Router();
var ObjectID = require("mongodb").ObjectID;
const sha256 = require("js-sha256").sha256;
const secretKeyN = require("../config/secret").secretKey;
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

let RotaractModel = mongoose.model("Rotaract");

/* GET Users page. */
router.get("/", (req, res, next) => {
  RotaractModel.find({}, (err, docs) => {
    if (!err) {
      res.json({ users: docs });
    } else {
      res.json({ error: "no rotaract found" });
    }
  });
});

router.post("/addRotaract", async (req, res) => {
  let userDetails = new RotaractModel({
    name: req.body.name,
    fees: req.body.fees,
    rotaractID: req.body.rotaractID
  });

  console.log(userDetails, "newuser");

  const doesUserExist = await RotaractModel.exists({ name: req.body.name });

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
