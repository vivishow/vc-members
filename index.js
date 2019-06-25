const koa = require("koa");
const bodyParser = require("koa-bodyparser");
const app = new koa();
const router = require("./route");

app.use(bodyParser());

// app.use(async ctx => {
//   ctx.body = "hello world";
// });

app.use(router.routes());

app.listen(3000, () => {
  console.log("http://127.0.0.1:3000");
});
