import { createServer } from "node:http";
import mongoose, { Schema } from "mongoose";

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST;
const URL = process.env.MONGO_URL;
const DB = process.env.DB_NAME;
const COLL = process.env.DB_COLLECTION;

const schema = new Schema({
  id: { type: Number, require: true, unique: true },
  name: { type: String, require: true, unique: true },
});

const conn = mongoose.createConnection(URL, {
  dbName: DB,
});

const isModel = conn.model("myModel", schema, COLL);

const server = createServer(async (req, res) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("content-type", "application/json");
  res.setHeader("access-control-allow-headers", "content-type, x-user-id");
  res.setHeader("access-control-allow-methods", "GET, POST, PUT, DELETE");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  switch (req.method) {
    case "GET":
      const data = await isModel.find({}, { _id: 0, __v: 0 });
      if (Array.isArray(data)) {
        res.writeHead(200);
        res.end(JSON.stringify(data));
      } else {
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Server failed to fetch data" }));
      }
      break;
    case "POST":
      let isBody;
      req.on("data", (data) => {
        isBody = JSON.parse(data.toString());
      });
      req.on("end", async () => {
        const isExist = await isModel.exists({
          name: { $regex: new RegExp(`^${isBody.name}$`, "i") },
        });
        if (isExist === null) {
          const lastId = await isModel.findOne({}, { _id: 0, id: 1 }).sort({
            id: -1,
          });
          const isId = lastId ? lastId + 1 : 1;
          const obj = { id: isId, ...isBody };
          const toInsert = await isModel.create(obj, { ordered: true });
          if (toInsert) {
            res.writeHead(201);
            res.end(JSON.stringify({ success: "Data inserted" }));
          } else {
            res.writeHead(500);
            res.end(JSON.stringify({ error: "Error submitting data" }));
          }
        } else {
          res.writeHead(409);
          res.end(JSON.stringify({ error: "Username already exist" }));
        }
      });
      break;
    default:
      res.writeHead(405);
      res.end(JSON.stringify({ error: "Method not supported" }));
      break;
  }
});

server.listen(PORT, HOST);
