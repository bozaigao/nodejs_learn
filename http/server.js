const http = require("http");
const url = require("url");
const fs = require("fs");
const qs = require("querystring");
const game = require("./game");
http
  .createServer(function (req, res) {
    const Url = url.parse(req.url);
    if (Url.pathname === "/favicon.ico") {
      res.writeHead(200);
      res.end();
    }

    if (Url.pathname === "/") {
      res.writeHead(302, {
        "content-type": "text/html;charset=utf-8",
      });
      fs.createReadStream(__dirname + "/index.html").pipe(res);
    } else if (Url.pathname === "/game") {
      res.writeHead(302, {
        "content-type": "application/json;charset=utf-8",
      });
      res.end("你赢了", "utf8");
      // const playAction = qs.parse(Url.query).playAction;
      // if (game(playAction) === 1) {
      //   res.writeHead(200, {
      //     "content-type": "text/html;charset=utf-8",
      //     Location: "https://www.baidu.com",
      //   });
      //   res.end("你赢了", "utf8");
      // } else if (game(playAction) === -1) {
      //   res.writeHead(200, { "content-type": "text/html;charset=utf-8" });
      //   res.end("你输了", "utf8");
      // } else {
      //   res.writeHead(200, { "content-type": "text/html;charset=utf-8" });
      //   res.end("平局!", "utf8");
      // }
    }
  })
  .listen(4000);
