// Tiny static server for local testing of app/ (Node 22, standard library
// only). Serves app/ at http://localhost:8080 (`node serve.ts --port 8081`
// for another port). Development convenience only, not part of the entry.
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("./app", import.meta.url)));
const portArg = process.argv.indexOf("--port");
const port = portArg === -1 ? 8080 : Number(process.argv[portArg + 1]) || 8080;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

createServer((req, res) => {
  let path = "/";
  try { path = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname); } catch { res.writeHead(400).end(); return; }
  if (path.endsWith("/")) path += "index.html";
  const file = resolve(join(root, normalize(path)));
  if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
  try {
    if (!statSync(file).isFile()) throw new Error("not a file");
  } catch { res.writeHead(404).end("not found"); return; }
  res.writeHead(200, { "content-type": MIME[extname(file).toLowerCase()] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(port, "127.0.0.1", () => console.log(`app/ is on http://localhost:${port}`));
