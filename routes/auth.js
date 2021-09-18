const express = require("express");
const util = require("util");
const crypto = require("crypto");

const User = require("../models/User");

const router = express.Router();
const scrypt = util.promisify(crypto.scrypt);

//// ADD USER
router.post("/signup", async (req, res) => {
  // making user object
  const salt = crypto.randomBytes(8).toString("hex");
  const buf = await scrypt(req.body.password, salt, 64);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: `${buf.toString("hex")}.${salt}`,
  });

  try {
    // add to db
    await user.save();
    res.status(200).send("Success");
  } catch (e) {
    if (e.keyPattern.email == 1) {
      res.status(405).send("Email already in use");
    } else {
      res.status(500).json(e);
    }
  }
});

//// LOGIN
router.post("/login", async (req, res) => {
  try {
    // check for email
    const supplied = req.body.password;
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const [hashed, salt] = user.password.split(".");
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

    if (hashed !== hashedSuppliedBuf.toString("hex")) {
      return res.status(403).send("Incorrect password");
    }

    res.status(200).json(user);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

module.exports = router;
