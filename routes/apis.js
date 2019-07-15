require("dotenv").config();
const Router = require("koa-router");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const URI = process.env.DB;
const dbname = "vcproject";

const router = new Router();

// 获取查询条件下所有用户信息
router.get("/api/members", async (ctx, next) => {
  const client = new MongoClient(URI, { useNewUrlParser: true });
  await client.connect();
  const col = client.db(dbname).collection("vivi");

  // 模糊查询
  let query = {};
  const {
    nickName,
    noteName,
    uid,
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
  if (uid) {
    query.uid = Number(uid);
  }

  let r = await col
    .find(query)
    .limit(Number(limit))
    .sort([[sortName, sort ? 1 : -1]])
    .skip(Number(skip))
    .toArray();

  client.close();
  ctx.body = { code: 1, message: r };
});

// 获取指定ID用户信息
router.get("/api/members/:id", async (ctx, next) => {
  const id = ObjectId(ctx.params.id);
  const client = new MongoClient(URI, { useNewUrlParser: true });
  await client.connect();
  const col = client.db(dbname).collection("vivi");
  let r = await col.findOne({ _id: id });
  client.close();
  ctx.body = r
    ? { code: 1, message: r }
    : { code: -1, message: "没有这个用户" };
});

// 添加用户
router.post("/api/members", async (ctx, next) => {
  const { nickName, noteName } = ctx.request.body;
  let res = { code: -1, message: "出错了" };
  if (nickName) {
    const client = new MongoClient(URI, { useNewUrlParser: true });
    const time = new Date();
    await client.connect();
    const col = client.db(dbname).collection("vivi");
    let r = await col.countDocuments({
      nickName: nickName,
      noteName: noteName || ""
    });
    if (r !== 0) {
      client.close();
      throw "昵称和备注名已经存在，请修改！";
    } else {
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
      res = r.result.ok
        ? { code: 1, message: "成功" }
        : { code: -1, message: "出错了" };
    }
  } else {
    throw "nickName is required";
  }
  ctx.body = res;
});

// 添加用户积分记录
router.post("/api/members/:id/points", async (ctx, next) => {
  const data = ctx.request.body;
  let res = { code: -1, message: "出错了" };
  if (data.reason && Number(data.value)) {
    const client = new MongoClient(URI, { useNewUrlParser: true });
    await client.connect();
    const col = client.db(dbname).collection("vivi");
    let time = new Date();
    record_time = time.toLocaleDateString();
    const pointsRecord = {
      createtime: record_time,
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
    res = r.ok ? { code: 1, message: "成功" } : { code: -1, message: "出错了" };
  } else {
    throw "reason and value is required";
  }
  ctx.body = res;
});

// 添加用户联系方式
router.post("/api/members/:id/contact", async (ctx, next) => {
  const { address, name, tel } = ctx.request.body;
  if (address && tel && name) {
    const client = new MongoClient(URI, { useNewUrlParser: true });
    await client.connect();
    const col = client.db(dbname).collection("vivi");
    const time = new Date();
    let contact = { address: address, name: name, tel: tel };
    let r = await col.findOneAndUpdate(
      { _id: ObjectId(ctx.params.id) },
      { $addToSet: { contact: contact }, $set: { update_on: time } },
      { returnOriginal: false }
    );
    client.close();
    ctx.body = r.ok
      ? { code: 1, message: "成功" }
      : { code: -1, message: "出错了" };
  } else {
    throw "addr and phone is required";
  }
});

// 修改用户昵称或备注
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
    ctx.body = r.ok
      ? { code: 1, message: "成功" }
      : { code: -1, message: "出错了" };
  } else {
    throw "nickName or noteName is required";
  }
});

// 删除指定ID用户
router.delete("/api/members/:id", async (ctx, next) => {
  const client = new MongoClient(URI, { useNewUrlParser: true });
  await client.connect();
  const col = client.db(dbname).collection("vivi");
  let r = await col.findOneAndDelete({ _id: ObjectId(ctx.params.id) });
  client.close();
  ctx.body = r.ok
    ? { code: 1, message: "成功" }
    : { code: -1, message: "出错了" };
});

// 删除指定用户的指定联系方式
router.delete("/api/members/:id/contact", async (ctx, next) => {
  const { address, name, tel } = ctx.request.body;
  if (address && tel && name) {
    const client = new MongoClient(URI, { useNewUrlParser: true });
    await client.connect();
    const col = client.db(dbname).collection("vivi");
    const time = new Date();
    let r = await col.findOneAndUpdate(
      {
        _id: ObjectId(ctx.params.id)
      },
      {
        $pull: { contact: { address: address, name: name, tel: tel } },
        $set: { update_on: time }
      },
      { returnOriginal: false }
    );
    console.log(r);

    client.close();
    ctx.body = r.ok
      ? { code: 1, message: "成功" }
      : { code: -1, message: "出错了" };
  } else {
    throw "addr and phone and name are required";
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
