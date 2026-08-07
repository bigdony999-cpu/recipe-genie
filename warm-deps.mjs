import { createServer } from "vite";
import { existsSync } from "node:fs";

const server = await createServer({
  server: { middlewareMode: true },
  logLevel: "warn",
});

try {
  await server.warmupRequest("/src/main.tsx");
} catch (e) {
  console.log("warmup skip main");
}

const deadline = Date.now() + 162_000;
while (Date.now() < deadline && !existsSync("node_modules/.vite/_metadata.json")) {
  await new Promise((r) => setTimeout(r, 1500));
}

console.log(
  "metadata:",
  existsSync("node_modules/.vite/_metadata.json") ? "PRESENT" : "MISSING",
);
await server.close();
console.log("DONE");
