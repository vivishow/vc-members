const jwt = require("jsonwebtoken");

module.exports = function verify() {
  return async (ctx, next) => {
    const url = ctx.request.url;
    if (/^\/api/.test(url) && url != "/api/login") {
      const token = ctx.request.header.token;
      if (token) {
        try {
          const decoded = jwt.verify(token, "xx990707");
          ctx.u_name = decoded.u_name;
          await next();
        } catch (err) {
          console.log(err);
          ctx.body = { code: -2, message: "认证失败" };
        }
      } else {
        ctx.body = { code: -2, message: "认证失败" };
      }
    } else {
      await next();
    }
  };
};
