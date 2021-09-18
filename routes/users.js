const express = require("express");
const util = require("util");
const crypto = require("crypto");

const User = require("../models/User");

const router = express.Router();
const scrypt = util.promisify(crypto.scrypt);

//// GET USER (QUERY METHOD)
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  const email = req.query.email;

  try {
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (username) {
      user = await User.findOne({ username: username });
    } else {
      user = await User.findOne({ email: email });
    }

    const { password, createdAt, updatedAt, isAdmin, ...ret } = user._doc;

    res.status(200).json(ret);
  } catch (e) {
    res.status(404).json("No such user");
  }
});

//// UPDATE USER
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        // salting
        const salt = crypto.randomBytes(8).toString("hex");
        const buf = await scrypt(req.body.password, salt, 64);
        req.body.password = `${buf.toString("hex")}.${salt}`;
      } catch (e) {
        return res.status(500).json(e);
      }
    }

    try {
      //updating
      await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      res.status(200).json("Updated Profile !");
    } catch (e) {
      res.status(500).json(e);
    }
  } else {
    res.status(403).json("Invalid request");
  }
});

module.exports = router;
