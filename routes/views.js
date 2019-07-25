const Router = require("koa-router");

const router = new Router();

router.get("/", async (ctx, next) => {
  // let res = await axios.get(`http://${ctx.host}/api/members`);
  // await ctx.render("index", { users: res.data.message });
  await ctx.render("index");
  // ctx.body = { req: ctx.request, res: ctx.response };
});

module.exports = router;
