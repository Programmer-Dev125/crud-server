import mongoose, { Schema } from "mongoose";
import http from "node:http";

// const port = process.env.PORT;
// const host = process.env.HOST;
const URL = process.env.MONGO_URL;

const conn = mongoose.createConnection(URL);
const model = conn.model(
  "customModel",
  new Schema({ id: Number, name: String }),
  "user"
);

const server = http.createServer(async (req, res) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "GET, POST, DELETE, PUT");
  res.setHeader("access-control-allow-headers", "content-type, x-user-id");
  res.setHeader("content-type", "application/json");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === "GET") {
    const isData = await model.find({}, { _id: 0, __v: 0 });
    if (Array.isArray(isData)) {
      res.writeHead(200);
      res.end(JSON.stringify(isData));
    } else {
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Error fetching data" }));
    }
  } else {
    res.writeHead(405);
    res.end(
      JSON.stringify({
        error: "Invalid Method",
        allowedMethods: ["GET", "POST", "PUT", "DELETE"],
      })
    );
  }
});

server.listen(port, host);
