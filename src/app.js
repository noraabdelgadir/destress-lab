'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const users = require('./routes/user-routes');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('<h1>Response.</h1>');
});

app.get('/signup', (req, res) => {
    res.sendFile('./pages/auth.html', { root: __dirname });
})

// RESTful
app.get('/users', users.findAll);

app.post('/user', (req, res) => {
    users.create(req, res)
});

app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});

module.exports = app;