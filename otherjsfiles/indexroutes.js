const express = require('express');
const User = require("../models/Users");
const indexroutes = express.Router();

//create an express router:
// const data = require('../models/data'); //two dots, goes back a directory, and then one dot searches within current directory 


indexroutes.get('/', function (req, res) {
    User.find({})
        .then(function (foundUsers) {
            res.render("home", { users: foundUsers });  //only pass one object, with many keys
        })
        .catch(err => { console.log(err); res.status(500).send(err) });
});

module.exports = indexroutes;