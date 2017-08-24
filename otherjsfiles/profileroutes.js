//import express (for each separate file)
const express = require('express');
//create a router
const profileroutes = express.Router();
const data = require('../models/data');

profileroutes.get("/:id", (req, res) => {
    let reqId = req.params.id;
    console.log(req.params.id);
    let foundUser = data.users.find(user => user.id == reqId);

    if (foundUser) {
        return res.render("profile", { foundUser: foundUser });
    } else {
        return res.send("ERROR ERROR WILL ROBBINSON")
    }
});
module.exports = profileroutes;
//export the route
//req.params.id follows the route to the specific id number in this case
