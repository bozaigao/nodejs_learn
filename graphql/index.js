const koa = require("koa");
const fs = require("fs");
const static = require("koa-static");
const mount = require("koa-mount");
const graphqlHTTP = require("koa-graphql");
const app = new koa({});
app.use(mount("/static", static(__dirname + "/source/static")));
app.use(mount("/api", graphqlHTTP({ schema: require("./schema") })));
app.use(
  mount("/", (ctx) => {
    ctx.body = fs.readFileSync(__dirname + "/source/index.htm", "utf-8");
  })
);
app.listen(3000);

module.exports = app;
