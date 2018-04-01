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
const ms = require('mediaserver');
const request = require('request');
const rp = require('request-promise');
const n = 10;

/*  Middleware  */
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({secret: 'Secret cookie!'}));

/*  Page loading    */
app.get('/', (req, res) => {
    res.sendFile('./src/pages/home.html', {root: __dirname});
    console.log("loading main");
});

app.get('/images/grape.png', (req, res) => {
    ms.pipe(req, res, './src/assets/images/grape.png');
});

app.get('/images/pop.png', (req, res) => {
    ms.pipe(req, res, './src/assets/images/pop.png');
});

app.get('/game/pop', (req, res) => {
    res.sendFile('./src/pages/pop-game.html', {root: __dirname});
});

app.get('/game/shooter', (req, res) => {
    res.sendFile('./src/pages/shooter-game.html', {root: __dirname});
});

/*  Game API    */
app.get('/music/bensound-jazzcomedy.mp3', (req, res) => {
    ms.pipe(req, res, './src/assets/music/bensound-jazzcomedy.mp3');
});

app.get('/music/bensound-thejazzpiano.mp3', (req, res) => {
    ms.pipe(req, res, './src/assets/music/bensound-thejazzpiano.mp3');
});

function getCollection(breeds, callback) {
    var promises = [];
    var images = [];
    var queryUrl = 'http://dog.ceo/api/breeds/image/random';
    console.log(breeds);

    // Make n request-promises that add the image url to images on success
    for(var i = 0; i < n; i++) {
        if(breeds.length > 0) {
            queryUrl =  "https://dog.ceo/api/breed/" + breeds[Math.round(Math.random() * (breeds.length - 1))] + "/images/random"
        }
        console.log(queryUrl);
        var data = {
            uri: queryUrl,
            qs: {},
            json: true
        };
        promises.push(rp(data).then(function(img) {
            images.push(img.message);
        }));
    }

    // Wait for all promises and call callback on success
    Promise.all(promises).then(function(results) {
      callback(images);
    }).catch(function(e) {
      console.log(e);
    });
}

app.get('/game/pop/images', (req, res) => {
    var breeds = [];
    if(req.session.user) {
        breeds = req.session.user.breeds;
    }
    getCollection(breeds, (images) => {
        res.send(JSON.stringify(images));
    });
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
                    res.status(300);
                    res.send('Username taken.');
                } else {
                    User.create(newUser, (err, returnUser) => {
                        if (err) throw err;
                        else {
                            console.log("User " + req.body.username + " created.");
                            req.session.user = {id: returnUser._id, username: returnUser.username, breeds: [], stressors: []};
                            res.status(201);
                            res.send(JSON.stringify({'breeds': [], 'stressors': []}));
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
    console.log('looking for user on database');
    User.findOne({'username': username}, (err, user) => {
        if (err) throw err;
        else if (user) {
            console.log('user  exists');
            // Compare plaintext password to its encrypted counterpart on DB
            bcrypt.compare(pwd, user.password, (err, bcryptRes) => {
                if (bcryptRes) {
                    console.log("User " + username + " logged in.");
                    req.session.user = {id: user._id, username: username, 'breeds': user.breeds, 'stressors': user.stressors};
                    res.status(200);
                    res.send(JSON.stringify({'breeds': user.breeds, 'stressors': user.stressors}));
                } else {
                    res.status(300);
                    res.send('Login failed.');
                }
            });
        } else {
            res.status(300);
            res.send('Login failed.');
        }
    });
});

app.get('/user/logout', (req, res) => {
    req.session.destroy (function() {
        res.status(204);
        res.send('Logged out.');
    });
});

app.delete('/user', (req, res) => {
    User.remove({_id: req.session.user.id}, (err, data) => {
        if (err) throw err;
        else {
            req.session.destroy (function() {
                res.status(202);
                res.send('Deleted account.');
            });
        }
    });
});

/* User settings */

app.post('/user/addBreed', (req, res) => {
  var username = req.session.user.username;
  var breeds = req.session.user.breeds;
  breeds.push(req.body.newBreed);

  User.findOne({username: username}, function(err, user) {
    if(err) throw err;
    user.breeds = breeds;

    user.save(function(err) {
      if(err) throw err;
    });

    res.status(200);
    res.send(JSON.stringify({'breeds': user.breeds}));
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
    res.status(200);
    res.send(JSON.stringify({'breeds': user.breeds}));
  });
});

app.post('/user/addStressor', (req, res) => {
  var username = req.session.user.username;
  var stressors = req.session.user.stressors;
  stressors.push(req.body.newStressor);

  User.findOne({username: username}, function(err, user) {
    if(err) throw err;
    user.stressors = stressors;

    user.save(function(err) {
      if(err) throw err;
    });
    res.status(200);
    res.send(JSON.stringify({'stressors': user.stressors}));
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
    res.status(200);
    res.send(JSON.stringify({'stressors': user.stressors}));
  });
});

/*  Protected pages */

/*  Helper function to check authenticated user */
function checkAuth(req) {
    if (!req.session.user) {
        return False;
    }
    return True;
}

app.get('/user/stressors', (req, res) => {
    res.status(200);
    res.send(req.session.user.stressors);
});

/*  Start server    */
app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});

module.exports = app;
