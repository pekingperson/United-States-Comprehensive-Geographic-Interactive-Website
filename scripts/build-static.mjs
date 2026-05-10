import { cp, mkdir, rm } from "node:fs/promises";

const output = "dist";
const entries = ["index.html", "political-map.html", "assets", "data"];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const entry of entries) {
  await cp(entry, `${output}/${entry}`, { recursive: true });
}

console.log(`Built static site in ${output}/`);
