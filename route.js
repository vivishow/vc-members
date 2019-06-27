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
  await client.connect();
  const col = client.db(dbname).collection("vivi");
  let r = await col.find({}).toArray();
  ctx.body = r;
  client.close();
});

router.get("/api/members/:id", async (ctx, next) => {
  const id = ObjectId(ctx.params.id);
  const client = new MongoClient(URI, { useNewUrlParser: true });
  await client.connect();
  const col = client.db(dbname).collection("vivi");
  let r = await col.findOne({ _id: id });
  ctx.body = r;
  client.close();
});

router.post("/api/members", async (ctx, next) => {
  const client = new MongoClient(URI, { useNewUrlParser: true });
  const data = ctx.request.body;
  if (data.nickName) {
    const time = new Date();
    await client.connect();
    const col = client.db(dbname).collection("vivi");
    let r = await col.insertOne({
      nickName: data.nickName,
      noteName: data.noteName || "",
      contactAddr: data.contactAddr || "",
      contactPhone: data.contactPhone || "",
      contact: data.contact || [],
      points: 0,
      pointsRecord: [],
      create_on: time,
      update_on: time
    });
    ctx.body = r.ok ? "success" : "error";
    client.close();
  } else {
    ctx.body = "nickName is required";
  }
});

router.post("/api/members/:id/points", async (ctx, next) => {
  const data = ctx.request.body;
  if (data.reason && Number(data.value)) {
    const client = new MongoClient(URI, { useNewUrlParser: true });
    await client.connect();
    const col = client.db(dbname).collection("vivi");
    const id = ObjectId(ctx.params.id);
    const time = new Date();
    const pointsRecord = {
      id: ObjectId(),
      createtime: time,
      reason: data.reason,
      value: Number(data.value)
    };
    let r = await col.findOneAndUpdate(
      { _id: id },
      {
        $push: { pointsRecord: pointsRecord },
        $inc: { points: pointsRecord.value },
        $set: { update_on: time }
      },
      {
        returnOriginal: false
      }
    );
    ctx.body = r.ok ? "success" : "error";
    client.close();
  } else {
    ctx.body = "reason and value is required";
  }
});

router.post("/api/members/:id/contact", async (ctx, next) => {});

router.post("/api/members/:id", async (ctx, next) => {});

router.delete("/api/members/:id", async (ctx, next) => {});

router.delete("/api/members/:id/contact", async (ctx, next) => {});

router.post("/api/test", async (ctx, next) => {
  console.log(ctx.request.body);

  ctx.body = ctx.request.body;
});

router.get("/api/test/:any", async (ctx, next) => {
  ctx.body = ctx.params;
});

module.exports = router;
