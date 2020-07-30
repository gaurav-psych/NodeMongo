const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const crypto = require("crypto");
const path = require("path");

const mongoURI = "mongodb://localhost:27017/GauravPersonal";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Init gfs
let gfs;

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  // we're connected!
  console.log("Yass DB connected");
  gfs = Grid(db.db, mongoose.mongo);
  gfs.collection("uploads");
});

// Create storage engine
const fileStorage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage: fileStorage });

const Users = require("./users.model");

module.exports = {
  uploadFile: upload
};
