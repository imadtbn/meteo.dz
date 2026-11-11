#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(ROOT, "precache-manifest.json");
const INCLUDED_ASSET_EXTENSIONS = new Set([
  ".js", ".mjs", ".css", ".json", ".svg",
  ".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".ico",
  ".woff", ".woff2", ".ttf", ".otf"
]);
const assets = new Set(["./", "./index.html", "./offline.html", "./manifest.json", "./favicon.svg"]);

function walk(directory, visitor) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute, visitor);
    else if (entry.isFile()) visitor(absolute);
  }
}

function addFile(absolute) {
  const relative = path.relative(ROOT, absolute).split(path.sep).join("/");
  assets.add("./" + relative);
}

walk(ROOT, (absolute) => {
  if (!absolute.endsWith(".html") || absolute.endsWith(".template.html")) return;
  if (absolute.includes(path.sep + ".github" + path.sep)) return;
  if (absolute.includes(path.sep + "scripts" + path.sep)) return;
  addFile(absolute);
});

for (const directory of ["assets", "data"]) {
  walk(path.join(ROOT, directory), (absolute) => {
    if (INCLUDED_ASSET_EXTENSIONS.has(path.extname(absolute).toLowerCase())) {
      addFile(absolute);
    }
  });
}

const sortedAssets = [...assets].sort();
const missing = sortedAssets.filter((asset) => {
  const relative = asset === "./" ? "index.html" : asset.replace(/^\.\//, "");
  const absolute = path.join(ROOT, relative);
  return !fs.existsSync(absolute) || !fs.statSync(absolute).isFile();
});
if (missing.length) {
  console.error("PWA precache contains missing files:", missing.join(", "));
  process.exit(1);
}

const requiredHtml = [];
const requiredRuntimeAssets = [];
walk(ROOT, (absolute) => {
  if (absolute.endsWith(".html") && !absolute.endsWith(".template.html") &&
      !absolute.includes(path.sep + "scripts" + path.sep) &&
      !absolute.includes(path.sep + ".github" + path.sep)) {
    requiredHtml.push("./" + path.relative(ROOT, absolute).split(path.sep).join("/"));
  }
});
walk(path.join(ROOT, "assets"), (absolute) => {
  const extension = path.extname(absolute).toLowerCase();
  if (extension === ".js" || extension === ".mjs" || extension === ".css") {
    requiredRuntimeAssets.push("./" + path.relative(ROOT, absolute).split(path.sep).join("/"));
  }
});

const coverage = new Set(sortedAssets);
const uncovered = [...requiredHtml, ...requiredRuntimeAssets].filter((asset) => !coverage.has(asset));
if (uncovered.length) {
  console.error("PWA precache coverage is incomplete:", uncovered.join(", "));
  process.exit(1);
}

const manifest = { version: 1, assets: sortedAssets };
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(
  "PWA precache manifest generated:",
  sortedAssets.length,
  "files (",
  requiredHtml.length,
  "HTML pages and",
  requiredRuntimeAssets.length,
  "JS/CSS runtime files )."
);
