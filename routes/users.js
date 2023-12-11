//#region Imports

var express = require("express");
var router = express.Router();
require("../models/connection");

const User = require("../models/users");

const { checkBody } = require("../modules/checkBody");

// creation d 'un token unique par utilisateur;
const uid2 = require("uid2");

//hashage du mot de passe ;
const bcrypt = require("bcrypt");


// check si un utilisateur existe deja  si non permet de créer un utilisateur 
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["storeName", "username", "password", "email"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({
    username: { $regex: new RegExp(req.body.username, "i") },
  }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        storeName: req.body.storeName,
        username: req.body.username,
        email: req.body.email,
        token: uid2(32),
        password: hash,
      });
      newUser.save().then((data) => {
        res.json({ result: true, token: data.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: "User already exists" });
    }
  });
});

router.put("/updateAdmin", (req, res) => {
  const { token } = req.body;

  User.updateOne({ token }, { $set: { isAdmin: true } }).then(() => {
    User.find().then(() => {
      res.json({
        result: true,
        message: "user status:isAdmin update to true ",
      });
    });
  });
});
 //Permet de verifier si l'utilsateur existe avant de ce connecter
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty field" });
    return;
  }
  User.findOne({
    username: { $regex: new RegExp(req.body.username, "i") },
  }).then((data) => {
    if (bcrypt.compareSync(req.body.password, data.password)) {
      res.json({
        result: true,
        token: data.token,
        username: data.username,
        storeName: data.storeName,
      });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});

router.get("/allUser", (req,res) =>{
  User.find()
  .then(data=>{
    if(data){
      res.json({data})
    }else{
      res.json({result:false, error:'User not found'})
    }
  })
})







router.delete("/", (req, res) => {
  const { token,username } = req.body;
  
  // Check if the user making the request is an admin
  User.findOne({token}).then((requestingUser)=>{
    if(!requestingUser||!requestingUser._id){
      res.json({ result: false, error: "Unauthorized" });
    }else{
      // retrieve the user to be delete

      User.findOne({ username }).then((userToDelete)=>{
        if(!userToDelete){
          res.json({result: false, error: "User not found"})
        }else{
          // delete the user
          User.deleteOne({ _id: userToDelete._id }).then(()=>{
            res.json({ result: true, message: "User deleted successfully" });
          })
        };
      })
    };
  })

  
  
});

module.exports = router;
