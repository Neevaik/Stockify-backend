var express = require('express');
var router = express.Router();



const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');

// creation d 'un token unique par utilisateur;
const uid2 = require('uid2');

//hashage du mot de passe ;
const bcrypt = require('bcrypt');



router.post('/signup', (req, res)=> {
  if (!checkBody(req.body, ['storeName', 'username', 'password','email'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
    User.findOne({username :{$regex : new RegExp(req.body.username,'i')}}).then(data =>{
      if (data === null){
        const hash= bcrypt.hashSync(req.body.password,10);
      }
      
    })




});

router.post('/signin', (req, res)=> {
  
});

router.delete('/:username', (req, res)=> {
  
});

module.exports = router;
