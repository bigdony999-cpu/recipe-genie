import { createServer } from "vite";

console.log("PROBE_START");
const server = await createServer({
  server: { middlewareMode: true },
  logLevel: "info",
  optimizeDeps: { include: ["react", "react-dom", "convex/react"] },
});
console.log("SERVER_CREATED warmupRequest:", typeof server.warmupRequest);

const withTimeout = (p, ms, label) =>
  Promise.race([
    p,
    new Promise((_, rej) =>
      setTimeout(() => rej(new Error(label + " timeout " + ms + "ms")), ms),
    ),
  ]);

try {
  await withTimeout(server.warmupRequest("/src/main.tsx"), 45000, "main");
  console.log("MAIN_WARMED");
} catch (e) {
  console.log("WARM_FAIL:", e.message);
}

const fs = await import("node:fs");
const count = (d) => {
  try {
    return fs.readdirSync(d).length;
  } catch {
    return 0;
  }
};
console.log("deps files:", count("node_modules/.vite/deps"));
console.log("deps_temp files:", count("node_modules/.vite/deps_temp"));
console.log("metadata:", fs.existsSync("node_modules/.vite/_metadata.json") ? "yes" : "no");

await server.close();
console.log("CLOSED");
