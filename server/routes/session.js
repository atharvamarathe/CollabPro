const express = require("express");
const router = express.Router();
const cors = require("cors");
const { Sessiondb } = require("../models/session");

// create a new paper in database
router.post("/create_session", cors(), async (req, res) => {
  console.log("create_session  hello");

  console.log(req.body);
  console.log("create_session");

  try {
    const newsession = await new Sessiondb(req.body);
    await newsession.save();
    console.log("SESSION CREATED");
    res.send({ success: true });
  } catch (err) {
    console.log("SESSION NOT ", err);
    res.send({ success: false });
  }
});

router.post("/get_sessions", cors(), async (req, res) => {
  console.log("GET SESSIONS ", req.body.user_id);
  Sessiondb.find({ user_id: req.body.user_id }, function (err, docs) {
    console.log(docs);
    res.send(docs);
  });
});

module.exports = router;
