const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.json());

const connection = mysql.createConnection({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'kali',
    database: 'users'
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

//get all users
app.get('/users', (req, res) => {
    connection.query('SELECT * FROM user', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

//get user by id
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM user WHERE id = ?', id, (error, results) => {
        if (error) throw error;
        res.json(results[0]);
    });
});

//create user
app.post('/users', (req, res) => {
    const { username } = req.body;
    connection.query('INSERT INTO user (username) VALUES (?)', [username], // id auto increments
    (error, results) => {
        if (error) throw error;
        res.send('User added successfully');
    });
});

//update user
app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const { username } = req.body;
    connection.query('UPDATE user SET username = ? WHERE id = ?', [username, id], 
    (error, results) => {
        if (error) throw error;
        res.send('User updated successfully');
    });
});

//delete user
app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM user WHERE id = ?', id, 
    (error, results) => {
        if (error) throw error;
        res.send('User deleted successfully');
    });
});