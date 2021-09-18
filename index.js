const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const noteRouter = require("./routes/notes");

const app = express();

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to DB .... "))
  .catch((e) => console.log(e));

app.use(cors());

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/note", noteRouter);

app.listen(3001, () => {
  console.log("listening at 3001 ......");
});
