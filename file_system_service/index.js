const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;


const storageDirectory = '/app/stored_files';  // this should match with docker-compose volume mapping

app.get('/', (req, res) => {
    res.send('File System Service');
});

app.get('/list_files', (req, res) => {
    fs.readdir(storageDirectory, function (err, files) {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        res.status(200).send({ files: files });
    });
});

app.listen(port, () => {
    console.log(`File System Service listening at http://localhost:${port}`);
});

