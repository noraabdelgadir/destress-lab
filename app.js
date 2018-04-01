'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const User = require('./src/models/user');
const bcrypt = require('bcrypt');
const salt = 10;

/*  Middleware  */
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({secret: 'Secret cookie!'}));

/*  Page loading    */
app.get('/', (req, res) => {
    res.sendFile('./src/pages/main.html', {root: __dirname});
    console.log("loading main");
});

app.get('/login', (req, res) => {
    res.sendFile('./src/pages/login.html', {root: __dirname});
});

app.get('/signup', (req, res) => {
    res.sendFile('./src/pages/signup.html', {root: __dirname});
});

app.get('/games', (req, res) => {
    // Check for session here
    res.sendFile('./src/pages/games.html', {root: __dirname});
});

app.get('/game/pop', (req, res) => {
    res.sendFile('./src/pages/pop-game.html', {root: __dirname});
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
        // Encrypt and store encrypted password
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            var newUser = {
                'username': req.body.username,
                'password': hash,
                'breeds': [],
                'stressors': [],
            }

            User.findOne({'username': req.body.username}, (err, user) => {
                if (err) throw err;
                else if (user) {
                    console.log('Username taken!');
                    res.send({redirect: '/signup'});
                } else {
                    User.create(newUser, (err, user) => {
                        if (err) throw err;
                        else {
                            console.log("User " + req.body.username + " created.");
                            res.send({redirect: '/login'});
                        }
                    });
                }
            });
        });
    }
});

app.post('/user/login', (req, res) => {
    var username = req.body.username;
    var pwd = req.body.password;

    User.findOne({'username': username}, (err, user) => {
        if (err) throw err;
        else if (user) {
            console.log('user  exists');
            // Compare plaintext password to its encrypted counterpart on DB
            bcrypt.compare(pwd, user.password, (err, bcryptRes) => {
                if (bcryptRes) {
                    console.log("User " + username + " logged in.");
                    req.session.user = {id: user._id, username: username};
                    res.send({redirect: '/games/auth'});
                } else {
                    console.log('Username or password incorrect.');
                }
            });
        }
    });
});

app.get('/user/logout', (req, res) => {
    req.session.destroy (function() {
        console.log("Logged out.");
        res.sendFile('./src/pages/home.html', {root: __dirname});
    });
});

app.delete('/user', (req, res) => {
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

/* User settings */

app.post('/user/addBreed', (req, res) => {
  var username = req.session.user.username;
  var breeds = req.session.user.breeds;
  console.log(username);
  breeds.push(req.body.newBreed);

  User.findOne({username: username}, function(err, user) {
    if(err) throw err;
    user.breeds = breeds;

    user.save(function(err) {
      if(err) throw err;
    });
  });
});

app.post('/user/removeBreed', (req, res) => {
  var username = req.session.user.username;
  var breeds = req.session.user.breeds;
  var index = breeds.indexOf(req.body.toRemove);
  breeds.splice(index, 1);

  User.findOne({username: username}, function(err, user) {
    if(err) throw err;
    user.breeds = breeds;

    user.save(function(err) {
      if(err) throw err;
    });
  });
});

app.post('/user/addStressor', (req, res) => {
  var username = req.session.user.username;
  var stressors = req.session.user.stressors;
  console.log(username);
  stressors.push(req.body.newStressor);

  User.findOne({username: username}, function(err, user) {
    if(err) throw err;
    user.stressors = stressors;

    user.save(function(err) {
      if(err) throw err;
    });
  });
});

app.post('/user/removeStressor', (req, res) => {
  var username = req.session.user.username;
  var stressors = req.session.user.stressors;
  var index = stressors.indexOf(req.body.toRemove);
  stressors.splice(index, 1);

  User.findOne({username: username}, function(err, user) {
    if(err) throw err;
    user.stressors = stressors;

    user.save(function(err) {
      if(err) throw err;
    });
  });
});

app.post('/user/changeUsername', (req, res) => {
  var username = req.session.user.username;
  var newUsername = req.body.newUsername;

  User.findOne({username: username}, function(err, user) {
    if(err) throw err;
    user.username = newUsername;

    user.save(function(err) {
      if(err) throw err;
    });
  });
});

app.post('/user/changePassword', (req, res) => {
  var username = req.session.user.username;
  var newPassword = req.body.newPwd;

  User.findOne({username: username}, function(err, user) {
    if(err) throw err;
    user.password = newPassword;

    user.save(function(err) {
      if(err) throw err;
    });
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
    res.sendFile('./src/pages/games.html', {root: __dirname});
});

app.put('/user/info', checkAuth, (req, res) => {

})

/*  Start server    */
app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});

module.exports = app;
