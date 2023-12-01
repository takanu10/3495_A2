const express = require("express");
const mysql = require("mysql");

const app = express();
app.use(express.json()); // for parsing application/json

// Create MySQL connection
const db = mysql.createConnection({
  host: "mysql_db", // this should be the service name in docker-compose for MySQL
  user: "root",
  password: "rootpass",
  database: "videoDB",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Could not connect to DB:", err);
  } else {
    console.log("Connected to MySQL");
    const createTableQuery = `
        CREATE TABLE videos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            path VARCHAR(255) NOT NULL
        )
    `;
    db.query(createTableQuery, (err, result) => {
      if (err) {
        console.error("Error creating table:", err);
      } else {
        console.log("Table created successfully");
      }
    });
  }
});

// API to create a new video entry
app.post("/videos", (req, res) => {
  const { video_name, video_path } = req.body;
  const query = `INSERT INTO videos (name, path) VALUES ('${video_name}', '${video_path}')`;
  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ video_id: result.insertId });
  });
});

app.get("/", (req, res) => {
  res.send("test test");
});
// API to list all videos
app.get("/videos", (req, res) => {
  const query = "SELECT * FROM videos";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(results);
  });
});

// ... (You can add more APIs for reading a specific video, updating, and deleting)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
