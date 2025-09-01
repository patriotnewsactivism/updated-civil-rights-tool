const fs = require("fs");
const pkg = JSON.parse(fs.readFileSync("package.json","utf8"));
let changed = false;

if (pkg.postcss) {
  if (Array.isArray(pkg.postcss.plugins)) {
    pkg.postcss.plugins = pkg.postcss.plugins.map(p => p === "tailwindcss" ? "@tailwindcss/postcss" : p);
    changed = true;
  }
  if (pkg.postcss.plugins && typeof pkg.postcss.plugins === "object" && !Array.isArray(pkg.postcss.plugins)) {
    if (pkg.postcss.plugins.tailwindcss) {
      delete pkg.postcss.plugins.tailwindcss;
      pkg.postcss.plugins["@tailwindcss/postcss"] = {};
      changed = true;
    }
  }
  if (changed) fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
}
