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
