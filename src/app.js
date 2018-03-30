'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const User = require('./models/user');

/*  Middleware  */
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({secret: 'Secret cookie!'}));

/*  Page loading    */
app.get('/', (req, res) => {
    res.sendFile('./pages/home.html', {root: __dirname});
});

app.get('/login', (req, res) => {
    res.sendFile('./pages/login.html', {root: __dirname})
});

app.get('/signup', (req, res) => {
    res.sendFile('./pages/signup.html', {root: __dirname});
});

app.get('/games', (req, res) => {
    // Check for session here
    res.sendFile('./pages/games.html', {root: __dirname});
});

/*  RESTful User API    */
app.get('/users', (req, res) => {
    User.find({}, (err, allUsers) => {
        if (err) throw err;

        if (allUsers) {
            res.send('<h1>Users</h1><br>' + allUsers);
        } else {
            res.send('No users.');
        }
    });
}); // DEBUG

app.post('/user', (req, res) => {
    if(req.body.username && req.body.password) {
        var newUser = {
            'username': req.body.username,
            'password': req.body.password,
            'breeds': [],
            'stressors': [],
        }
    }
    User.create(newUser, (err, user) => {
        if (err) throw err;
        else {
            console.log("User " + req.body.username + " created.");
        }
    });

    res.send({redirect: '/games'});
});

app.post('/user/login', (req, res) => {
    var username = req.body.username;
    var pwd = req.body.password;

    var tryUser = {
        'username': username,
        'password': pwd
    }

    User.findOne(tryUser, (err, user) => {
        if (err) throw err;
        else if (user && user.username === tryUser.username && user.password === tryUser.password){
            console.log("User " + username + " logged in.");
            req.session.user = {id: user._id, username: username};
            res.send({redirect: '/games/auth'});
        }
    });
});

app.get('/user/logout', (req, res) => {
    console.log("Logging out.");
    req.session.destroy (function() {
        console.log("Logged out.");
        res.sendFile('./pages/home.html', {root: __dirname});
    });
});

app.delete('/user', (req, res) => {  // change to app.delete later
    console.log('Removing user');
    User.remove({_id: req.session.user.id}, (err, data) => {
        if (err) throw err;
        else {
            console.log(data);
            req.session.destroy (function() {
                console.log("Logged out.");
                res.send({redirect: '/'});
            });
        }
    });
});

/*  Protected pages */

/*  Helper function to check authenticated user */
function checkAuth(req, res) {
    if (!req.session.user) {
        return res.status(401).send();
    } 
    return res.status(200).send();
}

app.get('/games/auth', checkAuth, (req, res) => {
    res.sendFile('./pages/games.html', {root: __dirname});
});

/*  Start server    */
app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});

module.exports = app;