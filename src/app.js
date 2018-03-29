'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const users = require('./routes/user-routes');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile('./pages/home.html', {root: __dirname});
});

app.get('/signup', (req, res) => {
    res.sendFile('./pages/auth.html', {root: __dirname});
});

app.get('/games', (req, res) => {
    // Check for session here
    res.sendFile('./pages/games.html', {root: __dirname});
})

// RESTful
app.get('/users', users.findAll);

app.post('/user', (req, res) => {
    users.create(req, res);
    res.send({redirect: '/games'});
});

app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});

module.exports = app;