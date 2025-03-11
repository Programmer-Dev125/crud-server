import mongoose from "mongoose";
import http from "node:http";

const port = process.env.PORT;
const host = process.env.HOST;
const url = process.env.MONGO_URL;

const data = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Doe" },
  { id: 3, name: "Abdul Ahad" },
];

const server = http.createServer((req, res) => {
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
    res.writeHead(200);
    console.log(url);
    res.end(JSON.stringify(data));
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
