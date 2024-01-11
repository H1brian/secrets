//jshint esversion:6
import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import 'dotenv/config'; // enable process.env
import encrypt from "mongoose-encryption"


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(`${process.env.DATABASE_LOCAL}`, {useNewUrlParser: true})
    .then(() => {console.log("Connected to MongoDB!")});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home")
});
app.get("/login", (req, res) => {
    res.render("login")
});
app.get("/register", (req, res) => {
    res.render("register")
});
app.get("/register/secrets", (req, res) => {
    res.render("./secrets")
});

app.get("/logout", (req, res) => {
    res.render("home")
});
//register
app.post("/register", async (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password,
    });
    try {
        await newUser.save();
            res.render("secrets");
    } catch (err) {
        console.error(err);
    }
});

//login
app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        User.findOne({email: username})
            .then ((foundUser) => {
                if (foundUser) {
                    if (foundUser.password === password) {
                        console.log(foundUser.password)
                        res.render("secrets");
                    }
                }
            });
    } catch (err) {
        console.error(err);
    }
    }
);




const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});
