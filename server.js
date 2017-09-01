var express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const logger = require("morgan");
let session = require("express-session")
const mustacheExpress = require("mustache-express");
const bcrypt = require("bcryptjs");
const User = require("./models/Users");
const indexroutes = require("./otherjsfiles/indexroutes");
const profileroutes = require("./otherjsfiles/profileroutes");
const sessionConfig = require("./sessionConfig");
const bluebird = require("bluebird");
const dbUrl = "mongodb://localhost:27017/userDirectory";
mongoose.Promise = bluebird;
let db = mongoose.connect(dbUrl);
const mongo = require("mongodb");
const port = process.env.PORT || 8100
// const data = require("./models/data");
const app = express();


// app.get("/insertmany", (req, res) => {
//     MongoClient.connect(dbUrl, function (err, db) {
//         if (err) {
//             return res.status(500).send(err);
//         }

//         let Users = db.collection("Users");

//         Users.insertMany(data.users, function (err, db) {
//             if (err) {

//                 return res.status(500).send(err);
//             }
//             res.send(data.users);

//         });

//     });
// });


app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.use(express.static(path.join(__dirname, "./public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use("/", indexroutes);
app.use("/", profileroutes);
app.use(session(sessionConfig));

//calling routes:
app.use("/profile", profileroutes);

//databaseRoutes

//authRoutes.signup
app.get("/signup", function (req, res) {
    res.render("signup");
})

app.post("/signup", function (req, res) {
    let newUser = new User(req.body);
    let salt = bcrypt.genSaltSync(10);
    newUser.password = bcrypt.hashSync(newUser.password, salt);
    newUser
        .save()
        .then(function (savedUser) {
            res.redirect("/login")
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
});

//AuthorizationRoutes.login
app.get("/login", function (req, res) {
    res.render("login");
})

app.post("/login", function (req, res) {
    let reqUsername = req.body.username;
    let reqPassword = req.body.password;

    User.findOne({ username: reqUsername }).then(function (foundUser) {
        if (!foundUser) {
            return res.render("login", { errors: ["No user found."] });
        }

        const authorized = bcrypt.compareSync(reqPassword, foundUser.password);

        if (!authorized) {
            return res.render("login", { errors: ["Password does not match."] });
        }

        delete foundUser.password;
        req.session.user = foundUser;
        return res.redirect("/");
    });
});

//get employeed/unemployed
// $ne selects documents where value of field is NOT equal to the specified value
app.get("/employed", function (req, res) {
    User.find({ job: { $ne: null } }).then((employedBots) => {
        if (!employedBots) res.status(500).send("no employed bots");
        return res.render("home", { users: employedBots })
    })
});
app.get("/unemployed", function (req, res) {
    User.find({ job: null }).then((unemployedBots) => {
        if (!unemployedBots) res.status(500).send("no unemployed bots");
        res.render("home", { users: unemployedBots });
    })
});

//this is for editing a profile
app.get("/profile/:id", function (req, res) {
    User.findById(req.params.id)
        .then(function (foundUser) {
            if (!foundUser) {
                return res.send({ msg: "No User Found" })  //note the absence of plurality 
            }
            console.log("foundUser = ", foundUser);
            res.render("profile", { users: foundUser })
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
});

//this posts new information in the database
app.post("/profile", function (req, res) {
    let newUser = new User(req.body); //is this a method?? //what is an instance
    newSnippet
        .save()
        .then(function (savedSnippet) { //.then returns a promise(something executed after something is finished)
            return res.redirect("/");  //can send data, just can't merge data and templetes like render can
        })
        .catch(function (err) {    //.catch returns errors 
            return res.status(500).send(err);
        })
})

app.post("/profile/:id", function (req, res) {  //this is the update request 

    if (!req.body.job) {
        req.body.job = null;
    }

    User.findByIdAndUpdate(req.params.id, req.body)
        .then(function (updatedSnippet) {
            if (!updatedSnippet) {
                return res.send({ msg: "could not update user" });
            }
            res.redirect("/");
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
});
app.post("/delete/:id", function (req, res) {
    Snippet.findByIdAndRemove(req.params.id)
        .then(function () {
            res.redirect("/");
        })
        .catch(function (err) {
            res.status(500).send(err);
        });
});

app.listen(port, function () {
    console.log(`server is running on port ${port}!`);
});

//mongo 