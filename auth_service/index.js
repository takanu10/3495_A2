const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.static('public')); // Serve static files
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/authenticate', (req, res) => {
    const { name, password } = req.body;
    if (name === 'John' && password === '123') {
        res.status(200).redirect('http://20.175.151.1')
    } else {
        res.status(401).send('Wrong username or password');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Authentication Service listening at http://20.175.151.1:${port}`);
});
