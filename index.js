const koa = require("koa");
const app = new koa();
const router = require("./route");

// app.use(async ctx => {
//   ctx.body = "hello world";
// });

app.use(router.routes());

app.listen(3000);
