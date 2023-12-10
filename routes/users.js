var express = require('express');
var router = express.Router();


require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');




router.post('/signup', (req, res)=> {
  
});

router.post('/signin', (req, res)=> {
  
});

router.delete('/:username', (req, res)=> {
  
});

module.exports = router;
