//#region Imports

var express = require('express');
var router = express.Router();
require('../models/connection');

const User = require('../models/users');

const { checkBody } = require('../modules/checkBody');

//#endregion



// TODO : Create user in database


// TODO : Get All users


// TODO : Set user as admin


// TODO : If Admin => can delete one user


// TODO : Find password by Email



module.exports = router;
