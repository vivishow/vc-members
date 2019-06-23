const Router = require("koa-router");

const router = new Router();

router.get("/", async (ctx, next) => {
  ctx.body = `<h1>Index</h1>`;
});

router.get("/hello/:name", async (ctx, next) => {
  const name = ctx.params.name;
  ctx.body = `<h1>Hello, ${name}!</h1>`;
});

module.exports = router;
