import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { countTags } from "../src/lib/tags.js";

const postsDir = "posts";
const outDir = "public/posts";

fs.mkdirSync(outDir, { recursive: true });

const posts = [];

for (const file of fs.readdirSync(postsDir)) {
  if (!file.endsWith(".md")) continue;

  const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
  const { data, content } = matter(raw);

  const tags = data.tags ?? [];
  if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string")) {
    throw new Error(`${file}: tags must be a list of strings`);
  }

  const processed = await remark().use(remarkHtml, { sanitize: false }).process(content);
  const htmlContent = String(processed.value);

  const slug = file.replace(/\.md$/, "");

  fs.writeFileSync(`${outDir}/${slug}.html`, htmlContent, "utf8");
  posts.push({ ...data, tags: [...new Set(tags)], slug });
}

fs.writeFileSync(
  "public/posts.json",
  JSON.stringify({ posts, tagCounts: countTags(posts) }, null, 2),
  "utf8",
);
