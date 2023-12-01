const express = require("express");
const mysql = require("mysql");
const multer = require("multer");
const path = require("path");
const app = express();
const port = 3000;

// MySQL setup
const db = mysql.createConnection({
  host: "mysql_db", // this should be the service name in docker-compose for MySQL
  user: "root",
  password: "rootpass",
  database: "videoDB",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// Multer setup
const storage = multer.diskStorage({
  destination: "/app/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
}).single("videoFile");

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/upload.html");
});

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.send("An error occurred while uploading the video.");
    } else {
      const videoName = req.body.videoName;
      const videoPath = req.file.path;

      // Insert video details into MySQL database
      const query = `INSERT INTO videos (name, path) VALUES ('${videoName}', '${videoPath}')`;
      db.query(query, (err, result) => {
        if (err) throw err;
        res.send("Video uploaded and record saved.");
      });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
