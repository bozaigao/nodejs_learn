const express = require("express");
const url = require("url");
const fs = require("fs");
const qs = require("querystring");
const game = require("./game");

const app = express();

app.get("/favicon.ico", function (req, res) {
  res.writeHead(200);
  res.end();
});

app.get("/", function (req, res) {
  fs.createReadStream(__dirname + "/index.html").pipe(res);
});

app.get("/game", function (req, res) {
  const Url = url.parse(req.url);
  const playAction = qs.parse(Url.query).playAction;
  if (game(playAction) === 1) {
    res.writeHead(200, { "content-type": "text/html;charset=utf-8" });
    res.end("你赢了", "utf8");
  } else if (game(playAction) === -1) {
    res.writeHead(200, { "content-type": "text/html;charset=utf-8" });
    res.end("你输了", "utf8");
  } else {
    res.writeHead(200, { "content-type": "text/html;charset=utf-8" });
    res.end("平局!", "utf8");
  }
  fs.createReadStream(__dirname + "/index.html").pipe(res);
});

app.listen(3000);
