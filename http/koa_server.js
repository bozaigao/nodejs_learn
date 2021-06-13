/*
 * @Author: 波仔糕
 * @LastModifiedBy: 波仔糕
 */

const Koa = require("koa");
const fs = require("fs");
const mount = require("koa-mount");
const game = require("./game");

const app = new Koa();

app.use(
  mount("/favicon.ico", function (ctx) {
    ctx.status = 200;
  })
);

app.use(
  mount("/game", function (ctx) {
    const playAction = ctx.request.query.playAction;
    console.log(playAction);

    return new Promise((resolve, _) => {
      setTimeout(() => {
        if (game(playAction) === 1) {
          ctx.body = "你赢了";
        } else if (game(playAction) === -1) {
          ctx.body = "你输了";
        } else {
          ctx.body = "平局";
        }
        resolve();
      }, 1000);
    });
  })
);

app.use(
  mount("/", function (ctx) {
    ctx.body = fs.readFileSync(__dirname + "/index.html", "utf-8");
  })
);

app.listen(3000);
