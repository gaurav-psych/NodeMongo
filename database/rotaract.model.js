const mongoose = require("mongoose");

const RotaractSchema = new mongoose.Schema({
  rotaractID: {
    type: String,
    required: "Required"
  },
  fees: {
    type: Number,
    required: "Required"
  },
  name: {
    type: String,
    required: "Required"
  }
});

mongoose.model("Rotaract", RotaractSchema);
