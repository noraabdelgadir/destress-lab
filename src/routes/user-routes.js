const User = require('../models/user');

exports.findAll = function findUsers (req, res) {
    console.log('findAll');
    User.find({}, (err, allUsers) => {
        if (err) throw err;

        if (allUsers) {
            res.send('<h1>Users</h1><br>' + allUsers);
        } else {
            res.send('No courses.');
        }
    });
}