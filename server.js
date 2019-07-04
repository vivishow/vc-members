const koa = require("koa");
const view = require("koa-view");
const static = require("koa-static");
const bodyParser = require("koa-bodyparser");
const app = new koa();
const routerApi = require("./routes/apis");
const routerView = require("./routes/views");
const PORT = process.env.PORT || 3000;

app.use(view(__dirname + "/views"));
app.use(static(__dirname + "/assets"));
app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
    ctx.body = { status: -1, data: `${e}` };
  }
});

app.use(routerApi.routes(), routerApi.allowedMethods());
app.use(routerView.routes(), routerView.allowedMethods());

app.listen(PORT, () => {
  console.log(`http://127.0.0.1:${PORT}`);
});
