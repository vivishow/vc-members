require("dotenv").config();
const Router = require("koa-router");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const URI = process.env.DB;
const dbname = "vcproject";

const router = new Router();

router.get("/", async (ctx, next) => {
  ctx.body = `<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>`;
});

router.get("/hello/:name", async (ctx, next) => {
  const name = ctx.params.name;
  ctx.body = `<h1>Hello, ${name}!</h1>`;
});

router.get("/api/members", async (ctx, next) => {
  const client = new MongoClient(URI, { useNewUrlParser: true });
  try {
    await client.connect();
    const col = client.db(dbname).collection("vivi");
    let r = await col.find({}).toArray();
  } catch (error) {
    console.log(error);
    ctx.body = "error";
  }
  client.close();
});

router.post("/api/members", async (ctx, next) => {
  const client = new MongoClient(URI, { useNewUrlParser: true });
  try {
    await client.connect();
    const col = client.db(dbname).collection("vivi");
    let r = await col.find({}).toArray();
  } catch (error) {
    console.log(error);
    ctx.body = "error";
  }
  client.close();
});

router.post("/api/test", async (ctx, next) => {
  console.log(ctx.request.body);

  ctx.body = ctx.request.body;
});

module.exports = router;
