const http = require("http");
const express = require("express");
const cors = require("cors");
const router = express.Router();
const app = express();
const fs = require("fs");
const simpleGit = require("simple-git");
app.use(cors());
const server = http.createServer(app);

let repo = null;

require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
let isJoinSession = false;
let sessionId = 0;
app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/Collab-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const { Session } = require("./models/session");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const userSchema = new mongoose.Schema({
  username: String,
  user_id: Number,
  user_details: Object,
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

var username_auth_name;
var username_auth_id;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      username_auth_name = profile.displayName;
      username_auth_id = profile.id;
      username_auth_name.split(" ").join("_");
      User.findOrCreate(
        {
          user_id: profile.id,
          username: profile.displayName,
          user_details: profile.name,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000" }),
  function (req, res) {
    console.log("req.body");

    console.log(req.body);
    console.log("req.body");
    var string = username_auth_id + "&" + username_auth_name;
    // Successful authentication, redirect secrets.
    username_auth_name.split(" ").join("_");
    console.log("NAME : ", username_auth_name);
    if (isJoinSession) {
      isJoinSession = false;
      res.redirect(
        `http://localhost:3000/session?name=${username_auth_name}&sessionid=${sessionId}`
      );
    } else {
      res.redirect(
        "http://localhost:3000/userhome" +
          "/" +
          username_auth_id +
          "/" +
          username_auth_name
      );
    }
    // res.redirect("http://localhost:3000/userhome");
  }
);


router.get("/", (req, res) => {
  console.log(req.query.url);
  const git = simpleGit.default();
  repo = req.query.url;
  git.clone(repo);
  res.send({ response: "Done" }).status(200);
  console.log("done");
});

router.get("/delete", (req, res) => {
  fs.rmdirSync(repo, { recursive: true });
  res.send({ response: "Done deleting it" }).status(200);
});

app.use(router);
server.listen(process.env.PORT || 5000, () =>
  console.log(`Server has started.`)
);
