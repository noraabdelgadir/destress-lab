/* addBreed, removeBreed, addStressor, removeStressor, changeUsername, changePassword*/
const User = require('../models/user');

//ask how to get the current user
exports.addBreed = function addBreed(req, res) {
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

}

exports.removeBreed = function removeBreed(req, res) {
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
}

exports.addStressor = function addStressor(req, res) {
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

}

exports.removeStressor = function removeStressor(req, res) {
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
}

exports.changeUsername = function changeUsername(req, res) {
  var username = req.session.user.username;
  var newUsername = req.body.newUsername;

  User.findOne({username: username}, function(err, user) {
    if(err) throw err;
    user.username = newUsername;

    user.save(function(err) {
      if(err) throw err;
    });
  });
}

exports.changePassword = function changePassword(req, res) {
  var username = req.session.user.username;
  var newPassword = req.body.newPwd;

  User.findOne({username: username}, function(err, user) {
    if(err) throw err;
    user.password = newPassword;

    user.save(function(err) {
      if(err) throw err;
    });
  });
}
