const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

// Directory where files are stored; this should match the volume path in docker-compose
const storageDirectory = "../file_system_service/app/stored_files";

app.get("/", (req, res) => {
  fs.readdir(storageDirectory, function (err, files) {
    if (err) {
      return res.status(500).send("Unable to scan directory");
    }

    let fileListHtml = files
      .map((file) => {
        return `<li><a href="/download/${file}">${file}</a></li>`;
      })
      .join("");

    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Video List</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    padding: 20px;
                    background-color: #f4f4f4;
                }

                h1 {
                    color: #272727;
                }

                video {
                    width: 100%;
                    max-width: 600px;
                    margin-bottom: 20px;
                }

                button {
                    background-color: #4caf50;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    cursor: pointer;
                    font-size: 16px;
                }

                button:hover {
                    background-color: #45a049;
                }

                ul {
                    list-style-type: none;
                    padding: 0;
                }

                li {
                    margin-bottom: 10px;
                }

                a {
                    color: #007bff;
                    text-decoration: none;
                }

                a:hover {
                    text-decoration: underline;
                }
            </style>
            <script>
                function redirectToUpload() {
                    window.location.href = "http://20.104.33.211"; 
                }
            </script>
        </head>
        <body>
            <h1>Video Streaming</h1>
            <video controls width="600">
            <source src="/stream/videoFile-1696904869958.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            </br>
            <button onclick="redirectToUpload()">Upload Video</button>
    
            <h1>Video List</h1>
            <ul>
                ${fileListHtml}
            </ul>
        </body>
        </html>`;

    res.send(html);
  });
});

app.get("/stream/:filename", (req, res) => {
  const filePath = path.join(storageDirectory, req.params.filename);
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

app.get("/download/:filename", (req, res) => {
  const filePath = path.join(storageDirectory, req.params.filename);
  fs.exists(filePath, (exists) => {
    if (exists) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${req.params.filename}`
      );
      res.sendFile(filePath);
    } else {
      res.status(404).send("File not found");
    }
  });
});

app.listen(port, () => {
  console.log(`File System Service listening at ${port}`);
});
