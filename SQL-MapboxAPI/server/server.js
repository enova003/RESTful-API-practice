const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('client'));

const connection = mysql.createConnection({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'kali',
    database: 'mapbox'
});

app.get('/api/coordinates', (req, res) => {
    connection.query('SELECT latitude, longitude FROM poi', (error, results) => {
        if(error) console.error(error);
        res.json(results);
    });
});

app.post('/api/post/coordinates', (req, res) => {
    const { latitude, longitude } = req.body;
    connection.query('INSERT INTO poi (latitude, longitude) VALUES (?, ?)', [latitude, longitude], (error, results) => {
        if(error) console.error(error);
        res.json(results);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});