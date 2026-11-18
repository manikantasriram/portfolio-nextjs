/**
 * Generates the web-sized photo copies. Run `npm run photos` after adding a photo.
 *   reel/<slug>-560.webp, reel/<slug>-1080.webp   reel at 1x / 2x
 *   view/<slug>.webp                              photo page, full resolution
 * Also writes a 240px portrait. Originals in full/ are left untouched.
 */
import { mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../public/images/", import.meta.url));
const full = join(root, "photos", "full");
const reel = join(root, "photos", "reel");
const view = join(root, "photos", "view");

await mkdir(reel, { recursive: true });
await mkdir(view, { recursive: true });

const files = (await readdir(full)).filter((f) => f.endsWith(".jpg"));
for (const file of files) {
  const slug = file.replace(/\.jpg$/, "");
  const src = sharp(join(full, file)).rotate();
  await Promise.all([
    src.clone().resize({ height: 560 }).webp({ quality: 80 }).toFile(join(reel, `${slug}-560.webp`)),
    src.clone().resize({ height: 1080 }).webp({ quality: 78 }).toFile(join(reel, `${slug}-1080.webp`)),
    src.clone().webp({ quality: 86 }).toFile(join(view, `${slug}.webp`)),
  ]);
  console.log(`photo  ${slug}`);
}

await sharp(join(root, "manikanta-sriram-480.webp"))
  .resize(240)
  .webp({ quality: 82 })
  .toFile(join(root, "manikanta-sriram-240.webp"));
console.log("portrait  240px");
