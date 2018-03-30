/* addBreed, removeBreed, addStressor, removeStressor, changeUsername, changePassword*/
const User = require('../models/user');

//ask how to get the current user
exports.addBreed = function addBreed(req, res) {
  var username = req.session.currentUser.username;
  var breeds = req.session.currentUser.breeds;
  console.log(username);
  breeds.push(req.body.newBreed);

  User.findOne({username: username}, function(err, user) {
    if(err) throw err;
    user.breeds = breeds;

    user.save(function(err) {
      if(err) throw err;
    });
  });

}

exports.removeBreed = function removeBreed(req, res) {
  var username = req.session.currentUser.username;
  var breeds = req.session.currentUser.breeds;
  var index = breeds.indexOf(req.body.toRemove);
  breeds.splice(index, 1);

  User.findOne({username: username}, function(err, user) {
    if(err) throw err;
    user.breeds = breeds;

    user.save(function(err) {
      if(err) throw err;
    });
  });
}

exports.addStressor = function addStressor(req, res) {
  var username = req.session.currentUser.username;
  var stressors = req.session.currentUser.stressors;
  console.log(username);
  stressors.push(req.body.newStressor);

  User.findOne({username: username}, function(err, user) {
    if(err) throw err;
    user.stressors = stressors;

    user.save(function(err) {
      if(err) throw err;
    });
  });

}

exports.removeStressor = function removeStressor(req, res) {
  var username = req.session.currentUser.username;
  var stressors = req.session.currentUser.stressors;
  var index = stressors.indexOf(req.body.toRemove);
  stressors.splice(index, 1);

  User.findOne({username: username}, function(err, user) {
    if(err) throw err;
    user.stressors = stressors;

    user.save(function(err) {
      if(err) throw err;
    });
  });
}