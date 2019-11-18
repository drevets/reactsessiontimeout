const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.post("/login", (req, res) => {
  const token = jwt.sign({ data: "success!" }, "secret", {
    expiresIn: 60 * 30
  });
  res.send({ token });
});

app.post("/refresh", (req, res) => {
  if (Math.floor(Math.random() * Math.floor(9)) <= 8) {
    console.log("refresh success!");
    const token = jwt.sign({ data: "success!" }, "secret", {
      expiresIn: 60 * 30
    });
    res.send({ token });
  } else {
    res.sendStatus(403);
    console.log("refresh fails!!");
  }
});

app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);
