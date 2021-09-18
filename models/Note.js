const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    noteType: {
      type: String,
      require: true,
    },
    userId: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      max: 50,
      default: "",
    },
    desc: {
      type: String,
      max: 500,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);
