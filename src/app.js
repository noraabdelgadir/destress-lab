const express = require('express');

const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const users = require('./routes/user-routes');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('<h1>Response.</h1>');
});

// RESTful
app.get('/users', users.findAll);

app.get('/test-route', (req, res) => {
	res.send('<h1>Test.</h1>');
});

app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
})

module.exports = app;