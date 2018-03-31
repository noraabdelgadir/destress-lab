var path = require('path');

function loadMain (req, res, next) {
  res.sendFile(path.resolve('src/pages/main.html')); // tried both home and main
}

function loadImage (req, res, next) {
  res.sendFile(path.resolve('src/assets/images/grape.png'));
}

module.exports = {loadMain, loadImage};
