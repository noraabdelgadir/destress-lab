'use strict';

/*  Constants   */
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
const presetStressors =
    ['school', 'bills', 'osap loans', 'work', 'remark requests',
    'csc373', 'job applications', 'vacuum cleaners', 'time', 'health',
    'failure'];

/*  Middleware  */
app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({secret: 'Secret cookie!'}));

/*  Page loading    */
app.get('/', (req, res) => {
    res.sendFile('./src/pages/index.html', {root: __dirname});
});

app.get('/game/pop', (req, res) => {
    res.sendFile('./src/pages/pop-game.html', {root: __dirname});
});

app.get('/game/shooter', (req, res) => {
    res.sendFile('./src/pages/shooter-game.html', {root: __dirname});
});

/*  Other static files  */
app.get('/images/grape.png', (req, res) => {
    ms.pipe(req, res, './src/assets/images/grape.png');
});

app.get('/images/pop.png', (req, res) => {
    ms.pipe(req, res, './src/assets/images/pop.png');
});

app.get('/music/bensound-jazzcomedy.mp3', (req, res) => {
    ms.pipe(req, res, './src/assets/music/bensound-jazzcomedy.mp3');
});

app.get('/music/bensound-thejazzpiano.mp3', (req, res) => {
    ms.pipe(req, res, './src/assets/music/bensound-thejazzpiano.mp3');
});

/*
    User
*/

/**
 * Sends n requests to the dog.ceo api and gives callback
 * an array of n random dog image urls.
 * 
 * Reused from assignment 1.
 * @param {List} breeds 
 *  A list of dog breeds that the API should query for.
 * @param {function} callback 
 *  The function that takes in the collection array of
 *  dog image urls.
 */
function getCollection(breeds, callback) {
    var promises = [];
    var images = [];
    var queryUrl = 'http://dog.ceo/api/breeds/image/random';

    // Make n request-promises that add the image url to images on success
    for(var i = 0; i < n; i++) {
        if(breeds.length > 0) {
            queryUrl = "https://dog.ceo/api/breed/" + breeds[Math.round(Math.random() * (breeds.length - 1))] + "/images/random"
        }
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

/*  Query for dog image urls by user breed preference   */
app.get('/user/images', (req, res) => {
    var breeds = [];
    if(req.session.user) {
        breeds = req.session.user.breeds;
    }
    getCollection(breeds, (images) => {
        res.status(200);
        res.send(JSON.stringify(images));
    });
});

/*  Returns true if the user is authenticated, false otherwise  */
app.get('/user/isauth', (req, res) => {
    if(req.session.user) {
        res.send(JSON.stringify(true));
    } else {
        res.send(JSON.stringify(false));
    }
});

/*  Log a user out  */
app.get('/user/logout', (req, res) => {
    req.session.destroy (function() {
        res.status(204);
        res.send('Logged out.');
    });
});

/*  Create a new user   */
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

/*  Log a user in   */
app.post('/user/login', (req, res) => {
    var username = req.body.username;
    var pwd = req.body.password;
    User.findOne({'username': username}, (err, user) => {
        if (err) throw err;
        else if (user) {
            // Compare plaintext password to its encrypted counterpart on DB
            bcrypt.compare(pwd, user.password, (err, bcryptRes) => {
                if (bcryptRes) {
                    console.log("User " + username + " logged in.");
                    req.session.user = {id: user._id, username: username, 'breeds': user.breeds, 'stressors': user.stressors};
                    res.status(200);
                    res.send(JSON.stringify({'breeds': user.breeds, 'stressors': user.stressors}));
                } else {
                    console.log("Wrong password.");
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

/*  Delete a user   */
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

/*
    User settings
*/

/*  Query for user's breed preference   */
app.get('/user/breeds', (req, res) => {
    var breeds = [];
    if(req.session.user) {
        breeds = req.session.user.breeds;
    }
    res.status(200);
    res.send(JSON.stringify(breeds));
});

/*  Query for user's stressors  */
app.get('/user/stressors', (req, res) => {
    var stressors = presetStressors;
    if(req.session.user) {
        stressors = req.session.user.stressors;
    }
    res.status(200);
    res.send(JSON.stringify(stressors));
});

/*  Add a breed to user's breed preference  */
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

/*  Remove a breed from a user's breed preference   */
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

/*  Add a stressor to a user's stressors    */
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

/*  Remove a stressor from a user's stressors   */
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

/*  Start server    */
app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
});

module.exports = app;
