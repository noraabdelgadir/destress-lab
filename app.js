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
});

app.get('/images/grape.png', (req, res) => {
    ms.pipe(req, res, './src/assets/images/grape.png');
});

app.get('/images/patrick.jpg', (req, res) => {
    ms.pipe(req, res, './src/assets/images/patrick.jpg');
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

function getCollection(callback) {
    var promises = [];
    var images = [];

    // Make n request-promises that add the image url to images on success
    for(var i = 0; i < n; i++) {
      var data = {
        uri: 'http://dog.ceo/api/breeds/image/random',
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
    getCollection((images) => {
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
                    console.log('Username taken!');
                    res.status(300);
                } else {
                    User.create(newUser, (err, user) => {
                        if (err) throw err;
                        else {
                            console.log("User " + req.body.username + " created.");
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
                    req.session.user = {id: user._id, username: username};
                    res.status(200);
                    res.send(JSON.stringify({'breeds': user.breeds, 'stressors': user.stressors}));
                    } else {
                    console.log('Username or password incorrect.');
                }
            });
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
