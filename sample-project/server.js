const http = require("http");

const items = new Map();
let nextId = 1;

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  const path = req.url.split("?")[0];
  const method = req.method;

  // GET /items — retrieve all
  if (path === "/items" && method === "GET") {
    const list = Array.from(items.entries()).map(([id, data]) => ({ id, ...data }));
    res.end(JSON.stringify({ items: list }));
    return;
  }

  // GET /items/:id — retrieve one
  const getOne = path.match(/^\/items\/(\d+)$/);
  if (getOne && method === "GET") {
    const id = getOne[1];
    const item = items.get(id);
    if (!item) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Not found" }));
      return;
    }
    res.end(JSON.stringify({ id, ...item }));
    return;
  }

  // POST /items — add
  if (path === "/items" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      const data = JSON.parse(body || "{}");
      const id = String(nextId++);
      items.set(id, { name: data.name || "", value: data.value ?? 0 });
      res.statusCode = 201;
      res.end(JSON.stringify({ id, name: data.name, value: data.value }));
    });
    return;
  }

  // PUT /items/:id — update
  const putOne = path.match(/^\/items\/(\d+)$/);
  if (putOne && method === "PUT") {
    const id = putOne[1];
    if (!items.has(id)) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Not found" }));
      return;
    }
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      const data = JSON.parse(body || "{}");
      const current = items.get(id);
      const updated = {
        name: data.name !== undefined ? data.name : current.name,
        value: data.value !== undefined ? data.value : current.value,
      };
      items.set(id, updated);
      res.end(JSON.stringify({ id, ...updated }));
    });
    return;
  }

  // GET / — health
  if (path === "/" && method === "GET") {
    res.end(JSON.stringify({ ok: true, message: "Node sample server" }));
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Not found" }));
});

const port = process.env.PORT || 3000;
server.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
});
