var express = require("express");
const port = process.env.PORT || 8100
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const User = require("./models/Users");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const logger = require("morgan");
const mustacheExpress = require("mustache-express");
const indexroutes = require("./otherjsfiles/indexroutes");
const profileroutes = require("./otherjsfiles/profileroutes");
const dbUrl = "mongodb://localhost:27017/userDirectory";
let db = mongoose.connect(dbUrl);
let session = require("express-session")
const sessionConfig = require("./sessionConfig");

app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.use(express.static(path.join(__dirname, "./public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use("/", indexroutes);
app.use("/", profileroutes);
app.use(session(sessionConfig));

// app.get("/insertMany", function (req, res) {
//     let users = data.users;
//     let salt = bcrypt.genSaltSync(10);
//     users.forEach(function (user) {
//         user.password = bcrypt.hashSync("asdf", salt);
//         console.log(user);
//     })

//     User.insertMany(users, function (err, savedUsers) {
//         if (err) {
//             res.status(500).send(err);
//         }
//         res.send(savedUsers);
//     });
// });

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
            if (!savedUser) res.status(500).send(err);
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
        console.log('foundUser: ', foundUser);
        req.session.user = foundUser;
        console.log('foundUser: ', res.session);
        return res.redirect("/");
    });
});

//get employeed/unemployed
app.get("/employed", function (req, res) {
    Robots.find({ job: { $ne: null } }).toArray((err, employedBots) => {
        if (err) res.status(500).send(err);
        res.render("employee", { users: employedBots })
    })
});
app.get("/unemployed", function (req, res) {
    Robots.find({ job: null }).toArray((err, unemployedBots) => {
        if (err) res / status(500).send(err);
        res.render("unemployed", { users: employedBots });
    })
}

app.listen(port, function () {
        console.log(`server is running on port ${port}!`);
    });
