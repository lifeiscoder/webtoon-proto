const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");

app.use(
  session({
    secret: "thisisthesecretkeythekey",
    resave: false,
    saveUninitialized: false
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.use("/api/v1/user", require("./controllers/api/v1/user"));
app.use("/api/v1/wt", require("./controllers/api/v1/webtoon"));
app.use("/api/v1/bet", require("./controllers/api/v1/bet"));
app.use("/", require("./controllers/proto"));

const DB_URL = "mongodb://localhost:27017/wtProto";
mongoose.connect(DB_URL, { useNewUrlParser: true, useCreateIndex: true });

const db = mongoose.connection;

db.on("error", err => console.error(err));

db.once("open", () => {
  const port = process.env.WT_SERVER_PORT | 8080;

  app.listen(port, () => {
    console.log(`webserver on | port: ${port}`);
  });
});
