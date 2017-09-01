//import express (for each separate file)
const express = require('express');
const profileroutes = express.Router();
const User = require('../models/Users');

// profileroutes.get("/:id", (req, res) => {
//     User.findOne({ _id: ObjectId(req.params.id) }, function (err, foundUser) {
//         if (err) res.status(500).send(err);
//         if (!foundUser) res.send("no user found");
//         res.render("profile", { user: foundUser });
//     });
// });

module.exports = profileroutes;
//export the route
//req.params.id follows the route to the specific id number in this case
