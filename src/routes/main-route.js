const express = require('express');
const mainCtrl = require('../controllers/main-controller');
const router = express.Router();

// get the page
router.get('/', mainCtrl.loadMain);

// getting the image
router.get('/', mainCtrl.loadImage);

module.exports = router;
