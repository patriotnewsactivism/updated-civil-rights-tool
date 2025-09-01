// path: scripts/fix-postcss-tailwind.js
// Purpose: Migrate any PostCSS config using `tailwindcss` plugin -> `@tailwindcss/postcss` (Tailwind v4)
// Also ensures a single root postcss.config.js exists, removes conflicting duplicates, and verifies src/index.css.
// Run: node scripts/fix-postcss-tailwind.js

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

function exists(p) { return fs.existsSync(p); }
function read(p) { return fs.readFileSync(p, 'utf8'); }
function write(p, s) { fs.writeFileSync(p, s, 'utf8'); }
function backup(p) { if (!exists(p + '.bak')) fs.copyFileSync(p, p + '.bak'); }

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', '.git', 'build', 'dist'].includes(entry.name)) {
      yield* walk(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

function fixPostcssConfigFile(file) {
  const orig = read(file);
  let out = orig;
  let changed = false;

  // Replace CommonJS require('tailwindcss') with @tailwindcss/postcss
  out = out.replace(/require\(['"]tailwindcss['"]\)/g, () => { changed = true; return "require('@tailwindcss/postcss')"; });
  // Replace plain string plugin entries 'tailwindcss' -> '@tailwindcss/postcss'
  out = out.replace(/["']tailwindcss["']/g, () => { changed = true; return "'@tailwindcss/postcss'"; });

  // Remove accidental ESM import if present (very rare in CRA)
  out = out.replace(/from\s+['"]tailwindcss['"]/g, (m) => { changed = true; return m.replace('tailwindcss', '@tailwindcss/postcss'); });

  if (changed) {
    backup(file);
    write(file, out);
    return true;
  }
  return false;
}

function ensureRootPostcssConfig() {
  const rootJs = path.join(ROOT, 'postcss.config.js');
  const rootCjs = path.join(ROOT, 'postcss.config.cjs');
  const content = `module.exports = {\n  plugins: [\n    require('@tailwindcss/postcss'),\n    require('autoprefixer'),\n  ],\n};\n`;

  if (exists(rootJs)) {
    // make sure it's updated
    if (fixPostcssConfigFile(rootJs)) console.log('✔ Updated postcss.config.js');
    return 'js';
  }
  if (exists(rootCjs)) {
    if (fixPostcssConfigFile(rootCjs)) console.log('✔ Updated postcss.config.cjs');
    return 'cjs';
  }
  write(rootJs, content);
  console.log('✔ Created postcss.config.js');
  return 'js';
}

function fixAllConfigs() {
  const changed = [];
  for (const f of walk(ROOT)) {
    const base = path.basename(f).toLowerCase();
    if (/^postcss\.(config\.)?(js|cjs|mjs|json)$/.test(base)) {
      if (fixPostcssConfigFile(f)) changed.push(f);
    }
  }
  return changed;
}

function maybeDropDuplicateConfig(primaryKind) {
  // If both js and cjs exist at root, drop the non-primary to avoid CRA confusion.
  const rootJs = path.join(ROOT, 'postcss.config.js');
  const rootCjs = path.join(ROOT, 'postcss.config.cjs');
  if (exists(rootJs) && exists(rootCjs)) {
    const toRemove = primaryKind === 'js' ? rootCjs : rootJs;
    backup(toRemove);
    fs.unlinkSync(toRemove);
    console.log(`✔ Removed duplicate ${path.basename(toRemove)} (kept ${primaryKind})`);
  }
}

function fixPackageJsonPostcss() {
  const pkgPath = path.join(ROOT, 'package.json');
  if (!exists(pkgPath)) return false;
  const pkg = JSON.parse(read(pkgPath));
  if (!pkg.postcss) return false;

  let changed = false;
  // If a plugins array is present, rewrite any 'tailwindcss' entries
  if (Array.isArray(pkg.postcss?.plugins)) {
    pkg.postcss.plugins = pkg.postcss.plugins.map(p => p === 'tailwindcss' ? '@tailwindcss/postcss' : p);
    changed = true;
  }
  // If object with plugins object form
  if (pkg.postcss?.plugins && typeof pkg.postcss.plugins === 'object' && !Array.isArray(pkg.postcss.plugins)) {
    if (pkg.postcss.plugins['tailwindcss']) {
      delete pkg.postcss.plugins['tailwindcss'];
      pkg.postcss.plugins['@tailwindcss/postcss'] = {};
      changed = true;
    }
  }
  if (changed) {
    backup(pkgPath);
    write(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log('✔ Updated package.json postcss.plugins -> @tailwindcss/postcss');
  }
  return changed;
}

function ensureIndexCss() {
  // Ensure Tailwind v4 import exists
  const idx = path.join(ROOT, 'src', 'index.css');
  if (!exists(idx)) return false;
  const orig = read(idx);
  if (!/@import\s+["']tailwindcss["']/.test(orig)) {
    const out = `@import "tailwindcss";\n`;
    backup(idx);
    write(idx, out);
    console.log('✔ Wrote Tailwind v4 import to src/index.css');
    return true;
  }
  return false;
}

(function main(){
  console.log('[fix-postcss-tailwind] scanning...');
  const primary = ensureRootPostcssConfig();
  const changed = fixAllConfigs();
  maybeDropDuplicateConfig(primary);
  fixPackageJsonPostcss();
  ensureIndexCss();
  console.log(`[fix-postcss-tailwind] done. Files changed: ${changed.length}`);
})();
