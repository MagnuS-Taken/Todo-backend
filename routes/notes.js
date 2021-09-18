const express = require("express");

const Note = require("../models/Note");
const User = require("../models/User");

const router = express.Router();

//// CREATE POST
router.post("/", async (req, res) => {
  console.log(req.body);
  const note = new Note(req.body);
  try {
    const toAdd = await note.save();

    res.status(200).json(toAdd);
  } catch (e) {
    res.status(500).json(e);
  }
});

//// GET POST
router.get("/:id", async (req, res) => {
  try {
    const getNote = await Note.findById(req.params.id);

    res.status(200).json(getNote);
  } catch (e) {
    res.status(404).json("Note does not exist.");
  }
});

//// UPDATE POST
router.put("/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);

  try {
    if (note.userId === req.body.userId) {
      await Note.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      res.status(200).json("Updated Note !");
    } else {
      res.status(403).json("Invalid Request !");
    }
  } catch (e) {
    res.status(404).json("Note not found");
  }
});

//// DELETE POST
router.delete("/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  try {
    await Note.findOneAndDelete(req.params.id);
    res.status(200).json("Deleted Post !");
  } catch (e) {
    res.status(404).json("Post not found");
  }
});

//// GET ALL POSTS BY USER
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const notes = await Note.find({ userId: user._id });

    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
