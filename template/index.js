const koa = require("koa");
const static = require("koa-static");
const mount = require("koa-mount");
const client = require("./client");
const template = require("./template")(__dirname+'/index.html');

const app = new koa({});

app.use(mount("/static", static(__dirname + "/source/static/")));

app.use(
  mount("/", async (ctx) => {
    if (!ctx.query.columnid) {
      ctx.status = 400;
      ctx.body = "invalid columnid";
      return;
    }
    const res = await new Promise((resolve, reject) => {
      client.write({ columnid: ctx.query.columnid }, function (err, data) {
        err ? reject(err) : resolve(data);
      });
    });

    ctx.status = 200;
    ctx.body = template(res);
  })
);

app.listen(3000);

module.exports = app;
