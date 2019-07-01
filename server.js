const koa = require("koa");
const bodyParser = require("koa-bodyparser");
const app = new koa();
const router = require("./route");
const PORT = process.env.PORT || 3000;

app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
    ctx.body = `${e}`;
  }
});

app.use(router.routes());

app.listen(PORT, () => {
  console.log(`http://127.0.0.1:${PORT}`);
});
