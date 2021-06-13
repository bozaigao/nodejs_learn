const express = require("express");
const fs = require("fs");
const game = require("./game");

const app = express();

app.get("/favicon.ico", function (req, res) {
  res.status(200);
});

app.get("/", function (req, res) {
  res.send(fs.readFileSync(__dirname + "/index.html", "utf-8"));
});

//路由和中间件
app.get(
  "/game",
  function (req, res, next) {
    const playAction = req.query.playAction;
    if (game(playAction) === 1) {
      res.send("你赢了");
    } else if (game(playAction) === -1) {
      res.send("你输了");
    } else {
      res.send("平局");
    }
    res.flag = "执行完毕";
    next();
  },
  function (req, res, next) {
    console.log(res.flag);
  }
);

app.listen(3000);
