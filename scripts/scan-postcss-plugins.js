// path: scripts/scan-postcss-plugins.js
// Find any configs (outside node_modules) that still reference Tailwind as a PostCSS plugin.
// Run: node scripts/scan-postcss-plugins.js

const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git' || e.name === 'build' || e.name === 'dist') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function scanFile(file) {
  const txt = fs.readFileSync(file, 'utf8');
  const hits = [];
  const patterns = [
    /require\(['"]tailwindcss['"]\)/g,          // require('tailwindcss')
    /from\s+['"]tailwindcss['"]/g,               // import ... from 'tailwindcss'
    /['"]tailwindcss['"]/g,                       // 'tailwindcss' as a plugin string
    /plugins\s*:\s*\[\s*tailwindcss\s*[,\]]/g,  // plugins: [tailwindcss]
  ];
  for (const re of patterns) {
    if (re.test(txt)) hits.push(re.toString());
  }
  return hits;
}

const suspects = [];
for (const f of walk(ROOT)) {
  const base = path.basename(f).toLowerCase();
  if (/postcss\.|craco\.config|config-overrides|webpack\.|vite\.|rollup\./.test(base) || base.endsWith('.js') || base.endsWith('.cjs') || base.endsWith('.mjs') || base === 'package.json') {
    const hits = scanFile(f);
    if (hits.length) suspects.push({ file: path.relative(ROOT, f), hits });
  }
}

if (suspects.length === 0) {
  console.log('No stray tailwindcss PostCSS plugin references found (outside node_modules).');
} else {
  console.log('Found suspicious references:');
  for (const s of suspects) console.log(`- ${s.file} :: ${s.hits.join(', ')}`);
}
