const express = require('express');
const router = express.Router();

//Set up variables to hold our routes
const mainRoute = require('./main-route');

router.use('/', mainRoute);

module.exports = router;
