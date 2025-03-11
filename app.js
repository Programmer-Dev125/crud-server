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
  res.setHeader("access-control-allow-headers", "content-type, x-user-id");
  res.setHeader("access-control-allow-methods", "GET, POST, PUT, DELETE");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === "GET") {
    res.writeHead(200);
    res.end(JSON.stringify(data));
  } else if (req.method === "POST") {
    let isBody;
    req.on("data", (data) => {
      isBody = JSON.parse(data.toString());
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
  } else if (req.method === "PUT") {
    const isId = parseInt(req.headers["x-user-id"]);
    let isName;
    req.on("data", (data) => {
      isName = JSON.parse(data.toString());
    });
    req.on("end", () => {
      let hasEdit = false;
      for (let i = 0; i < data.length; i++) {
        if (data[i].id !== isId) continue;
        data[i].name = isName.name;
        hasEdit = true;
      }
      if (hasEdit) {
        res.writeHead(200);
        res.end(
          JSON.stringify({ success: "The user is changed", users: data })
        );
      } else {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Error updating data" }));
      }
    });
  } else if (req.method === "DELETE") {
    const isId = parseInt(req.headers["x-user-id"]);
    for (let i = 0; i < data.length; i++) {
      if (data[i].id !== isId) continue;
      data.splice(i, 1);
      res.writeHead(200);
      res.end(JSON.stringify({ succes: "The user is deleted", users: data }));
      return;
    }
    res.writeHead(400);
    res.end(JSON.stringify({ error: "Error deleting user" }));
  } else {
    res.writeHead(405);
    res.end(JSON.stringify({ error: "Method not supported" }));
  }
});

server.listen(PORT, HOST);
