import { createServer } from "node:http";

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST;

const data = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Doe" },
  { id: 3, name: "Josh Doe" },
];

const server = createServer((req, res) => {
  res.setHeader("access-control-allow-origin", "http://localhost:5173");
  res.setHeader("content-type", "application/json");

  if (req.method === "GET") {
    res.writeHead(200);
    res.end(JSON.stringify(data));
  }
});

server.listen(PORT, HOST);
