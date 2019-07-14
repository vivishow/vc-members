const Router = require("koa-router");
const axios = require("axios");

const router = new Router();

router.get("/", async (ctx, next) => {
  let res = await axios.get(`http://${ctx.host}/api/members`);
  await ctx.render("index", { users: res.data.message });
});

router.get("/member-info/:id", async (ctx, next) => {
  let id = ctx.params.id;
  let host = ctx.request.host;
  let res = await axios.get(
    `https://vc-members.herokuapp.com/api/members/${id}`
  );
  if (res.data.code == -1) {
    ctx.redirect("/");
  } else {
    await ctx.render("member-info", {
      host: host,
      ...res.data.message
    });
  }
  //   ctx.body = res.data.data;
});

router.get("/test", async (ctx, next) => {
  await ctx.render("test");
});

module.exports = router;
