const express = require("express");
const url = require("url");
const fs = require("fs");
const qs = require("querystring");
const game = require("./game");

const app = express();

app.get("/favicon.ico", function (req, res) {
  res.status(200);
});

app.get("/", function (req, res) {
  res.send(fs.readFileSync(__dirname + "/index.html", "utf-8"));
});

app.get("/game", function (req, res) {
  const Url = url.parse(req.url);
  const playAction = qs.parse(Url.query).playAction;
  if (game(playAction) === 1) {
    res.send("你赢了");
  } else if (game(playAction) === -1) {
    res.send("你输了");
  } else {
    res.send("平局");
  }
});

app.listen(3000);
