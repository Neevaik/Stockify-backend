var express = require("express");
var router = express.Router();
require("../models/connection");

const User = require("../models/users");

const { checkBody } = require("../modules/checkBody");


const jwt = require("jsonwebtoken");

const moment = require("moment");

// creation d 'un token unique par utilisateur;
const uid2 = require("uid2");

//hashage du mot de passe ;
const bcrypt = require("bcrypt");

const nodemailer = require("nodemailer");

const secretKey = uid2(32);


router.post("/addUser", (req, res) => {
  if (!checkBody(req.body, ["username", "password", "email"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const payload = {
    createdAt: moment().format("LLLL"),
    expiresAt: moment().add(5, "minutes").format("LLLL"), // 5 min plus tard
  };
 
  const token = jwt.sign(payload, secretKey, { algorithm: "HS256" });

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
        storeName: "NoStoreName",
        username: req.body.username,
        email: req.body.email,
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
  
  const id = req.params.id;
  User.updateOne(
    { _id: id },
    {
      isAdmin: req.body.isAdmin,
      username: req.body.username,
      email: req.body.email,
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
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty field" });
    return;
  }

  User.findOne({
    username: { $regex: new RegExp(req.body.username, "i") },
  }).then((data) => {
    if (bcrypt.compareSync(req.body.password, data.password)) {
      const decodedToken = jwt.decode(data.token);
      

      if (decodedToken && moment().isBefore(decodedToken.exp)) {
        // Le token actuel n'est pas expiré, renvoyez-le tel quel
        res.json({
          result: true,
          token: data.token,
          username: data.username,
          storeName: data.storeName,
        });
      } else {
        // Le token actuel est expiré, générez un nouveau
        const payload = {
          username: req.body.username,
          email: req.body.email,
          createdAt: moment().format("LLLL"),
          expiresAt: moment().add(5, "minutes").format("LLLL"),
        };

        
        const newAccessToken = jwt.sign(payload, secretKey, {
          algorithm: "HS256",
        });

        // Mise a jour du token dans la data base
        data.token = newAccessToken;
        data.save().then((data) => {
          res.json({
            result: true,
            payload:payload,
            token: newAccessToken,
            username: data.username,
            storeName: data.storeName,
          });
        });
      }
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
    console.log(data)
    if (data) {
      res.json({ id:data._id });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});


router.delete("/:email", (req, res) => {
 
  const { email } = req.params;

  // retrieve the user to be delete
  User.findOne({ email }).then((userToDelete) => {
    if (!userToDelete) {
      res.json({ result: false, error: "User not found" });
    } else {
      // delete the user
      User.deleteOne({ email: email }).then(() => {
        res.json({ result: true, message: "User deleted successfully" });
      });
    }
  });
});

console.log(process.env.SECRET_PASS)
const transporter = nodemailer.createTransport({
  service: "Gmail", 
  auth: {    
    user: "stockstockify@gmail.com", // Adresse e-mail à partir de laquelle vous envoyez les e-mails
    pass: process.env.SECRET_PASS // Mot de passe de l'adresse e-mail
  },
});

router.post("/forgotPassword", (req, res) => {
  const { email } = req.body;

  // Vérifiez si l'utilisateur avec cet e-mail existe
  User.findOne({ email }).then((user) => {
    if (!user) {
      res.json({ result: false, error: "User not found" });
    } else {
      // Générer un jeton unique pour la réinitialisation du mot de passe
      const resetToken = uid2(32);
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = moment().add(1, "hour");

      // Sauvegardez le jeton dans la base de données
      user.save().then(() => {

        const resetLink = `http://localhost:3001/resetPassword?token=${resetToken}`;


        // Utilisez ici une bibliothèque d'envoi d'e-mails (nodemailer, sendgrid, etc.)
        const mailOptions = {
          from: "stockstockify@gmail.com",
          to: email,
          subject: "Réinitialisation de mot de passe",
          text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            res.json({ result: false, error: "Failed to send password reset email" });
          } else {
            
            res.json({ result: true, message: "Password reset email sent successfully", token:resetToken });
          }
        });
      });
    }
  });
});


router.post("/resetPassword", (req, res) => {
  const { token, newPassword } = req.body;
  
  
  // Vérifiez si le jeton est valide et mettez à jour le mot de passe de l'utilisateur
  User.findOneAndUpdate(
    {
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: moment().toDate() },
    },
    {
      $set: {
        password: bcrypt.hashSync(newPassword, 10),
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    },
    { new: true } // Renvoie le document mis à jour
  )
    .then(data => {
      if (data) {
        console.log(data.password)
        res.json({ result: true, message: "Password reset successfully" });
      } else {
        res.json({ result: false, error: "Invalid or expired token" });
      }
    })
    .catch(error => {
      console.error('Error during password reset:', error);
      res.json({ result: false, error: "Failed to reset password" });
    });
});



router.post('/newUser',(req,res) => {
  const {token,newPassword} = req.body;
  User.findOne({token})
  .then(data => {
    data.password = bcrypt.hashSync(newPassword, 10);
    data.save()
    res.json({data})
  })
})


module.exports = router;