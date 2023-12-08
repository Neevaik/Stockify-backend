var express = require('express');
var router = express.Router();


require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');




router.get('/', function(req, res) {
  
});

module.exports = router;
