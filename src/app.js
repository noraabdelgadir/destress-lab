const express = require('express');

const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

const users = require('./routes/user-routes');
const settings = require('./routes/settings-router');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('<h1>Response.</h1>');
});

// RESTful
app.get('/users', users.findAll);

//not sure if this is even right but whatever, right?
app.post('/addBreed', settings.addBreed);

app.post('/removeBreed', settings.removeBreed);

app.post('/addStressor', settings.addStressor);

app.post('/removeStressor', settings.removeStressor);


app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
})

module.exports = app;
