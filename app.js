import { error } from "node:console";
import { createServer } from "node:http";

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST;

const data = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Doe" },
  { id: 3, name: "Josh Doe" },
];

const server = createServer((req, res) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("content-type", "application/json");
  res.setHeader("access-control-allow-headers", "content-type");

  if (req.method === "GET") {
    res.writeHead(200);
    res.end(JSON.stringify(data));
  } else if (req.method === "POST") {
    let isBody;
    req.on("data", (data) => {
      isBody = JSON.stringify(data.toString());
    });
    req.on("end", () => {
      const isObj = { id: data.length + 1, name: isBody.name };
      const ln = data.length;
      data.push(isObj);
      if (ln < data.length) {
        res.writeHead(200);
        res.end(JSON.stringify(data));
      } else {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Failed to submit user" }));
      }
    });
  } else {
    res.writeHead(405);
    res.end(JSON.stringify({ error: "Method not supported" }));
  }
});

server.listen(PORT, HOST);
