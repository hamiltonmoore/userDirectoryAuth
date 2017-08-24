const express = require('express');

//create an express router:
const indexroutes = express.Router();
const data = require('../models/data'); //two dots, goes back a directory, and then one dot searches within current directory 


indexroutes.get('/', function (req, res) {
    res.render("home", data);  //only pass one object, with many keys
});

module.exports = indexroutes;