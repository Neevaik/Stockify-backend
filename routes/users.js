//#region Imports

var express = require('express');
var router = express.Router();
require('../models/connection');

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

        const newUser= new User ({

        storeName : req.body.storeName,
        username: req.body.username,
        email: req.body.email,
        token: uid2(32),
        password: hash,
      });
      newUser.save().then(data => {
        res.json({ result: true, token: data.token });
      });

      }else{
          // User already exists in database
      res.json({ result: false, error: 'User already exists'})
      }
    });
});



router.post('/signin', (req, res)=> {
if (!checkBody(req.body,['username','password'])){
  res.json({result:false, error:'Missing or empty field'});
  return;
}
User.findOne({username:{$regex:new RegExp(req.body.username,'i')} }).then(data=>{
  if(bcrypt.compareSync(req.body.password,data.password)){
    res.json({result:true , token:data.token , username:data.username , storeName:data.storeName});
  }else{
    res.json({result:false , error:'User not found or wrong password'})
  }
})


});

router.delete('/:username', (req, res)=> {
  
});

module.exports = router;
