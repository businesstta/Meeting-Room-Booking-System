import { copyFile, cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "mobile-www");

await mkdir(output, { recursive: true });
await Promise.all(
  ["app.js", "styles.css", "manifest.json", "version.json"].map((file) =>
    copyFile(path.join(root, file), path.join(output, file))
  )
);

await rm(path.join(output, "assets"), { recursive: true, force: true });
await cp(path.join(root, "assets"), path.join(output, "assets"), { recursive: true });

console.log("Prepared locally bundled Capacitor assets in mobile-www.");
