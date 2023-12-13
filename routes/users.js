
var express = require("express");
var router = express.Router();
require("../models/connection");

const User = require("../models/users");

const { checkBody } = require("../modules/checkBody");

// creation d 'un token unique par utilisateur;
const uid2 = require("uid2");

//hashage du mot de passe ;
const bcrypt = require("bcrypt");

// ajoute un utilisateur dans la base de donnée

router.post("/addUser", (req, res) => {



  if (!checkBody(req.body, ["username", "password", "email"])) {
    res.json({ result: false, error: "Missing or empty fields " });
    return;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // permet de verifier le format d'un email comforme
  if (!emailRegex.test(req.body.email)) {
    res.json({ result: false, error: "Invalid email format" });
    return;
  }

  // Check if the user with the specified email already exists
  User.findOne({ email: req.body.email }).then((data) => {
    if (data === null) {
      // If the user doesn't exist, hash the password and create a new user
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        storeName: req.body.storeName,
        username: req.body.username,
        email: req.body.email,
        token: uid2(32),
        password: hash,
        isAdmin: req.body.isAdmin,
      });

      // Save the new user to the database
      newUser.save().then((data) => {
        res.json({ result: true, token: data.token });
      });
    } else {
      // If the user already exists, return an error
      res.json({ result: false, error: "User already exists" });
    }
  });
});

router.put("/updateUser/:id", (req, res) => {
 
  if (!checkBody(req.body, ["isAdmin"])) {
    res.json({ result: false, error: "isAdmin field missing " });
    return;
  }

  const id = req.params.id;

  User.updateOne(
    { _id: id },
    {
      isAdmin: req.body.isAdmin,
      username: req.body.username,
      email: req.body.email,
    })
  .then(() => {
    User.find()
    .then((data) => {
      if(data){
        res.json({
          result: true,
          message: "user update  ",
        });
      }else{
        res.json({ result: false, error: 'Product not found' });
      }
    
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
        data,
      });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  });
});


// affiche tout les utilisateur
router.get("/allUser", (req, res) => {
  User.find().then((data) => {
    if (data) {
      res.json({ data });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

router.post("/user", (req, res) => {
  const { username } = req.body;
  User.findOne({username}).then((data) => {
    if (data) {
      res.json({ id:data._id });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});


router.delete("/:email", (req, res) => {
 
  const { email } = req.params;


  User.findOne({ email }).then((userToDelete) => {
    if (!userToDelete) {
      res.json({ result: false, error: "User not found" });
    } else {
    
      User.deleteOne({ email: email }).then(() => {
        res.json({ result: true, message: "User deleted successfully" });
      });
    }
  });
});

module.exports = router;
