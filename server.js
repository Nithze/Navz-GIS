const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); // Tambahkan ini

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint untuk menyimpan data form
app.post('/save', (req, res) => {
    const { name, open, close, description, latitude, longitude } = req.body;
    const data = {
        id: uuidv4(), // Tambahkan ID unik di sini
        name,
        open,
        close,
        description,
        latitude,
        longitude
    };

    fs.readFile(path.join(__dirname, 'data/data.json'), 'utf8', (err, fileData) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).send('Error saving data');
        }

        let jsonData = [];

        try {
            jsonData = JSON.parse(fileData);
        } catch (error) {
            console.error('Error parsing JSON data:', error);
        }

        jsonData.push(data);

        fs.writeFile(path.join(__dirname, 'data/data.json'), JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error writing data file:', err);
                return res.status(500).send('Error saving data');
            }

            res.send('Data saved successfully');
        });
    });
});
// Endpoint untuk menampilkan semua data
app.get('/data', (req, res) => {
    fs.readFile(path.join(__dirname, 'data/data.json'), 'utf8', (err, fileData) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).send('Error retrieving data');
        }

        try {
            const jsonData = JSON.parse(fileData);
            res.json(jsonData);
        } catch (error) {
            console.error('Error parsing JSON data:', error);
            res.status(500).send('Error retrieving data');
        }
    });
});
// Add this to your server.js
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile(path.join(__dirname, 'data/user.json'), 'utf8', (err, fileData) => {
        if (err) {
            console.error('Error reading user file:', err);
            return res.status(500).send('Error logging in');
        }

        try {
            const users = JSON.parse(fileData);
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                // Login successful
                res.redirect('/admin.html');
            } else {
                // Login failed
                res.status(401).send('Invalid credentials');
            }
        } catch (error) {
            console.error('Error parsing JSON data:', error);
            res.status(500).send('Error logging in');
        }
    });
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

