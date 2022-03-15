const http = require("http");
const express = require("express");
const cors = require("cors");
const socketio = require("socket.io");
const querystring = require("query-string");
const { ExpressPeerServer } = require("peer");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInsessionid,
} = require("./users");
const app = express();
var bodyParser = require("body-parser");

const sessionRoutes = require("./routes/session");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
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

app.get("/joinsession/:sessionid", function (req, res) {
  console.log("Session ID is ", req.params);
  sessionId = req.params.sessionid;
  isJoinSession = true;
  res.redirect("http://localhost:5000/auth/google");
});

app.get("/logout", function (req, res) {
  res.redirect("http://localhost:3000/");
});

// const router = express.Router();

const fs = require("fs");
const simpleGit = require("simple-git");
var ShareDB = require("sharedb");
const router = require("./router");
var richText = require("rich-text");
var WebSocket = require("ws");
var WebSocketJSONStream = require("@teamwork/websocket-json-stream");
ShareDB.types.register(richText.type);
var backend = new ShareDB();
createDoc(startServer);
function createDoc(callback) {
  var connection = backend.connect();
  var doc = connection.get("examples", "richtext");
  doc.fetch(function (err) {
    if (err) throw err;
    console.log("doc is ", doc);
    if (doc.type === null) {
      console.log("Creating new One !");
      doc.create(
        [{ insert: "// Welcome to CollabPro!" }],
        "rich-text",
        callback
      );
      return;
    } else {
      console.log("Already Present ! : ", doc.type);
    }
    callback();
  });
}

function startServer() {
  // Create a web server to serve files and listen to WebSocket connections
  // var app = express();
  app.use(express.static("static"));
  // app.use(router);
  var sharedb_server = http.createServer(app);
  var server = http.createServer(app);
  const peerServer = ExpressPeerServer(server, {
    debug: true,
  });
  app.use("/peerjs", peerServer);
  const io = socketio(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  app.use(cors());
  app.use(router);
  app.use("/", sessionRoutes);

  io.on("connect", (socket) => {
    socket.on("join", ({ name, sessionid }, callback) => {
      const { error, user } = addUser({ id: socket.id, name, sessionid });

      if (error) return callback(error);

      socket.join(user.sessionid);

      socket.emit("message", {
        user: "admin",
        text: `${user.name}, welcome to sessionid ${user.sessionid}.`,
      });
      socket.broadcast.to(user.sessionid).emit("message", {
        user: "admin",
        text: `${user.name} has joined!`,
      });

      io.to(user.sessionid).emit("sessionidData", {
        sessionid: user.sessionid,
        users: getUsersInsessionid(user.sessionid),
      });

      callback();
    });
    socket.on("join-video", ({ id, sessionidId }) => {
      console.log(id, sessionidId);
      socket.join(sessionidId);
      socket.to(sessionidId).broadcast.emit("user-connected", id);
      socket.on("disconnect", () => {
        socket.to(sessionidId).broadcast.emit("user-disconnected", id);
      });
    });
    socket.on("send-ace-changes", (newValue) => {
      console.log("Changes : ", newValue);
      socket.broadcast.emit("receive-ace-changes", newValue);
    });
    socket.on("sendMessage", (message, callback) => {
      const user = getUser(socket.id);

      io.to(user.sessionid).emit("message", { user: user.name, text: message });

      callback();
    });
    socket.on("get-document", (documentId) => {
      const data = "";
      // Implement getDocument function
      socket.join(documentId);

      socket.emit("load-document", data);

      socket.on("send-text-changes", (delta) => {
        socket.broadcast.to(documentId).emit("receive-text-changes", delta);
      });
      //Implement save changes event
    });

    socket.on("disconnect", () => {
      const user = removeUser(socket.id);

      if (user) {
        io.to(user.sessionid).emit("message", {
          user: "Admin",
          text: `${user.name} has left.`,
        });
        io.to(user.sessionid).emit("sessionidData", {
          sessionid: user.sessionid,
          users: getUsersInsessionid(user.sessionid),
        });
      }
    });
  });
  server.listen(process.env.PORT || 5000, () =>
    console.log(`Server has started at 5000`)
  );
  // Connect any incoming WebSocket connection to ShareDB
  var wss = new WebSocket.Server({ server: sharedb_server });
  wss.on("connection", function (ws) {
    console.log("HIIIIQ");
    var stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  sharedb_server.listen(8080);
  console.log("ShareDB listening on http://localhost:8080");
}
