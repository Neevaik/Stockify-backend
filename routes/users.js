var express = require("express");
var router = express.Router();
require("../models/connection");

const User = require("../models/users");

const { checkBody } = require("../modules/checkBody");

const {checkBodyPassword}=require("../modules/checkPassword")

const jwt = require("jsonwebtoken");

const moment = require("moment");

// creation d 'un token unique par utilisateur;
const uid2 = require("uid2");

//hashage du mot de passe ;
const bcrypt = require("bcrypt");

// ajoute un utilisateur dans la base de donnée

router.post("/addUser", (req, res) => {
  if (!checkBody(req.body, ["username", "email"])) {
    res.json({ result: false, error: "Missing or empty fields " });
    return;
  }
  if(!checkBodyPassword(req.body,["password"])){
    res.json({result:false , error:"Wrong password or empty field"});
    return
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

      // Crée un objet payload (charges utiles) pour le token JWT avec date de creation et expiration
      const payload = {
        createdAt: moment().format("LLLL"),
        expiresAt: moment().add(1, "minutes").format("LLLL"), // 5 min plus tard
        // nextRefresh: moment()
        //   .add(5, "minutes")
        //   .endOf("minute")
        //   .add(1, "hour")
        //   .format("LLLL"),
      };
      const secretKey = uid2(32);
      const token = jwt.sign(payload, secretKey, { algorithm: "HS256" });

      console.log(payload);
      const newUser = new User({
        storeName: req.body.storeName.trim(),
        username: req.body.username.trim(),
        email: req.body.email.trim(),
        token: token,
        password: hash,
        isAdmin: req.body.isAdmin,
      });

      // Save the new user to the database
      newUser.save().then((data) => {
        res.json({
          result: true,
          token: data.token,
          payload: payload,
        });
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
      username: req.body.username.trim(),
      email: req.body.email.trim(),
    }
  ).then(() => {
    User.find().then(() => {
      res.json({
        result: true,
        message: "user update  ",
      });
    });
  });
});

//Permet de verifier si l'utilsateur existe avant de ce connecter

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username"])) {
    res.json({ result: false, error: "Missing or empty field" });
    return;
  }

  if(!checkBodyPassword(req.body,["password"])){
    res.json({result:false , error:"Wrong password or empty field"});
    return
  }

  User.findOne({
    username: { $regex: new RegExp(req.body.username, "i") },
  }).then((data) => {
    if (bcrypt.compareSync(req.body.password, data.password)) {
      const decodedToken = jwt.decode(data.token);


      const payload = {
        username: req.body.username,
        email: req.body.email,
        createdAt: moment().format("LLLL"),
        expiresAt: moment().add(5, "minutes").format("LLLL"),
        // nextRefresh: moment().add(1, "hour").format("LLLL"),
      };

      const secretKey = uid2(32);
      const newAccessToken = jwt.sign(payload, secretKey, {
        algorithm: "HS256",
      });

      data.token = newAccessToken;

      res.json({
            result: true,
            data: data,
            payload: decodedToken,
          });

        } else {
          res.json({ result: false, error: "User not found or wrong password" });
        }


      // Vérifiez si le token d'accès est expiré ou s'il est temps de le rafraîchir
      // if (
      //   moment(decodedToken.expiresAt) < moment() ||
      //   moment() > moment(decodedToken.nextRefresh)
      // ) {
      //   // Générez un nouveau token d'accès
        // const secretKey = uid2(32);
        // const newAccessToken = jwt.sign(payload, secretKey, {
        //   algorithm: "HS256",
        // });

        // Mettez à jour le token d'accès dans la base de données
        // data.token = newAccessToken;
        // data.nextRefresh = moment().add(1, "hour").format("LLLL"); // 1 heure plus tard
        // data.save();



        
        // res.json({
        //   result: true,
        //   data: data,
        //   payload: jwt.decode(newAccessToken),
        // });
      // } else {
      //   // Le token d'accès est toujours valide
      //   res.json({
      //     result: true,
      //     data: data,
      //     payload: decodedToken,
      //   });
      // }
    // } else {
    //   res.json({ result: false, error: "User not found or wrong password" });
    // }
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
  User.findOne({ username }).then((data) => {
    if (data) {
      res.json({ id: data._id });
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
