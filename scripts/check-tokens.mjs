// Fails if a colour in design/tokens.json differs from the same token in app/globals.css.
// Run with `npm run tokens:check` (CI runs it on every push).
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const tokens = JSON.parse(readFileSync(new URL("../design/tokens.json", import.meta.url), "utf8"));

function block(selector) {
  const start = css.indexOf(selector + " {");
  if (start < 0) throw new Error(`Could not find "${selector}" in app/globals.css`);
  const body = css.slice(start, css.indexOf("}", start));
  return Object.fromEntries([...body.matchAll(/--([a-z0-9]+):\s*(#[0-9a-f]{3,8})\s*;/gi)].map((m) => [m[1], m[2].toLowerCase()]));
}

const themes = { light: block(":root"), dark: block(':root[data-theme="dark"]') };
const problems = [];
for (const [theme, colors] of Object.entries(tokens.color)) {
  for (const [name, token] of Object.entries(colors)) {
    const inCss = themes[theme][name];
    if (inCss !== token.$value.toLowerCase()) problems.push(`${theme} --${name}: tokens.json ${token.$value}, globals.css ${inCss ?? "missing"}`);
  }
}

if (problems.length) {
  console.error("design/tokens.json is out of sync with app/globals.css:\n  " + problems.join("\n  "));
  process.exit(1);
}
console.log(`tokens ok: ${Object.values(tokens.color).reduce((n, c) => n + Object.keys(c).length, 0)} colours match app/globals.css`);
