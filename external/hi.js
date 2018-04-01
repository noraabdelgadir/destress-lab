'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
var path = require('path');
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile('./hi.html', {root: __dirname});
});

app.use(express.static(__dirname + '/'));

app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});

module.exports = app;


// var server = app.listen(3000, function() {
//   console.log('Running on 127.0.0.1:%s', server.address().port);
// });
