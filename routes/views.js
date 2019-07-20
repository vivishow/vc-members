const Router = require("koa-router");
const axios = require("axios");

const router = new Router();

router.get("/", async (ctx, next) => {
  // let res = await axios.get(`http://${ctx.host}/api/members`);
  // await ctx.render("index", { users: res.data.message });
  await ctx.render("index");
});

module.exports = router;
