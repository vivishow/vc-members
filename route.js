require("dotenv").config();
const Router = require("koa-router");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const URI = process.env.DB;
const dbname = "vcproject";

const router = new Router();

router.get("/", async (ctx, next) => {
  ctx.body = `
  <h1>hello index</h1>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>`;
});

router.get("/hello/:name", async (ctx, next) => {
  const name = ctx.params.name;
  ctx.body = `<h1>Hello, ${name}!</h1>`;
});

router.get("/api/members", async (ctx, next) => {
  const client = new MongoClient(URI, { useNewUrlParser: true });
  await client.connect();
  const col = client.db(dbname).collection("vivi");

  // 模糊查询
  let query = {};
  const {
    nickName,
    noteName,
    sortName = "update_on",
    sort = false,
    limit = 0,
    skip = 0
  } = ctx.query;
  if (nickName) {
    query.nickName = new RegExp(nickName);
  }
  if (noteName) {
    query.noteName = new RegExp(noteName);
  }

  let r = await col
    .find(query)
    .limit(Number(limit))
    .sort([[sortName, sort ? 1 : -1]])
    .skip(Number(skip))
    .project({ pointsRecord: 0 })
    .toArray();

  client.close();
  ctx.body = r;
});

router.get("/api/members/:id", async (ctx, next) => {
  const id = ObjectId(ctx.params.id);
  const client = new MongoClient(URI, { useNewUrlParser: true });
  await client.connect();
  const col = client.db(dbname).collection("vivi");
  let r = await col.findOne({ _id: id });
  client.close();
  ctx.body = r || "没有这个用户";
});

router.post("/api/members", async (ctx, next) => {
  const { nickName, noteName } = ctx.request.body;
  if (nickName && noteName) {
    const client = new MongoClient(URI, { useNewUrlParser: true });
    const time = new Date();
    await client.connect();
    const col = client.db(dbname).collection("vivi");
    let r = await col.countDocuments({
      nickName: nickName,
      noteName: noteName
    });
    console.log("countDocuments", r);

    if (r !== 0) {
      client.close();
      throw "昵称和备注名已经存在，请修改！";
    }
    r = await col.insertOne({
      nickName: nickName,
      noteName: noteName,
      contact: [],
      points: 0,
      pointsRecord: [],
      create_on: time,
      update_on: time
    });
    client.close();
    ctx.body = r.result.ok ? "success" : "error";
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
    const time = new Date();
    const pointsRecord = {
      createtime: time,
      reason: data.reason,
      value: Number(data.value)
    };
    let r = await col.findOneAndUpdate(
      { _id: ObjectId(ctx.params.id) },
      {
        $push: { pointsRecord: pointsRecord },
        $inc: { points: pointsRecord.value },
        $set: { update_on: time }
      },
      {
        returnOriginal: false
      }
    );
    client.close();
    ctx.body = r.ok ? "success" : "error";
  } else {
    ctx.body = "reason and value is required";
  }
});

router.post("/api/members/:id/contact", async (ctx, next) => {
  const { addr, phone } = ctx.request.body;
  if (addr && phone) {
    const client = new MongoClient(URI, { useNewUrlParser: true });
    await client.connect();
    const col = client.db(dbname).collection("vivi");
    const time = new Date();
    let contact = { addr: addr, phone: phone };
    let r = await col.findOneAndUpdate(
      { _id: ObjectId(ctx.params.id) },
      { $addToSet: { contact: contact }, $set: { update_on: time } },
      { returnOriginal: false }
    );
    client.close();
    ctx.body = r.ok ? "success" : "error";
  } else {
    ctx.body = "addr and phone is required";
  }
});

router.post("/api/members/:id", async (ctx, next) => {
  const { nickName, noteName } = ctx.request.body;
  if (nickName || noteName) {
    const client = new MongoClient(URI, { useNewUrlParser: true });
    await client.connect();
    const col = client.db(dbname).collection("vivi");
    const time = new Date();
    let name = {};
    if (nickName) {
      name.nickName = nickName;
    }
    if (noteName) {
      name.noteName = noteName;
    }
    let r = await col.findOneAndUpdate(
      { _id: ObjectId(ctx.params.id) },
      { $set: { update_on: time, ...name } },
      { returnOriginal: false }
    );
    client.close();
    ctx.body = r.ok ? "success" : "error";
  } else {
    ctx.body = "nickName or noteName is required";
  }
});

router.delete("/api/members/:id", async (ctx, next) => {
  const client = new MongoClient(URI, { useNewUrlParser: true });
  await client.connect();
  const col = client.db(dbname).collection("vivi");
  let r = await col.findOneAndDelete({ _id: ObjectId(ctx.params.id) });
  client.close();
  ctx.body = r.ok ? "success" : "error";
});

router.delete("/api/members/:id/contact", async (ctx, next) => {
  const { addr, phone } = ctx.request.body;
  if (addr && phone) {
    const client = new MongoClient(URI, { useNewUrlParser: true });
    await client.connect();
    const col = client.db(dbname).collection("vivi");
    const time = new Date();
    let r = await col.findOneAndUpdate(
      {
        _id: ObjectId(ctx.params.id)
      },
      {
        $pull: { contact: { addr: addr, phone: phone } },
        $set: { update_on: time }
      },
      { returnOriginal: false }
    );
    console.log(r);

    client.close();
    ctx.body = r.ok ? "success" : "error";
  } else {
    ctx.body = "addr and phone is required";
  }
});

router.post("/api/test", async (ctx, next) => {
  console.log(ctx.request.body);

  ctx.body = ctx.request.body;
});

router.get("/api/test/:any", async (ctx, next) => {
  ctx.body = {
    params: ctx.params,
    query: ctx.query,
    querystring: ctx.querystring
  };
});

module.exports = router;
