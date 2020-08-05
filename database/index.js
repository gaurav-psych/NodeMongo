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

const uploadFilesLocal = multer.diskStorage({
  destination: function(req, file, cb) {
    console.log(file.fieldname, "filenae");
    cb(null, "uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const uploadToLocal = multer({ storage: uploadFilesLocal });

const upload = multer({ storage: fileStorage });

const findFile = async (req, res, fileNameCame) => {
  gfs.files.findOne({ filename: fileNameCame }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists"
      });
    }
    // File exists and to download the file
    let readstream = gfs.createReadStream({
      filename: fileNameCame
    });
    readstream.pipe(res);
    // brlow can be share dofr json version of file
    // return res.json(file);
  });
};

const Users = require("./users.model");
const Rotaract = require("./rotaract.model");

module.exports = {
  uploadFile: upload,
  findFile: findFile,
  uploadToLocal: uploadToLocal
};
