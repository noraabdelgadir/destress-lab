const User = require('../models/user');

exports.findAll = function findUsers (req, res) {
    console.log('findAll');
    User.find({}, (err, allUsers) => {
        if (err) throw err;

        if (allUsers) {
            res.send('<h1>Users</h1><br>' + allUsers);
        } else {
            res.send('No users.');
        }
    });
}

exports.create = function createUser (req, res) {
    console.log('createUser');
    if(req.body.username && req.body.password) {
        var newUser = {
            username: req.body.username,
            password: req.body.password,
            breeds: [],
            stressors: [],
        }
    }
    User.create(newUser, (err, user) => {
        if (err) throw err;
        else {
            console.log("User " + req.body.username + " created.");
        }
    });
}