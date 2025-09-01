// path: scripts/fix-icons-and-tailwind.js
// Ensures missing lucide-react icon imports exist in src/App.enhanced.js
// and removes @tailwindcss/line-clamp from Tailwind plugins.
// Run: node scripts/fix-icons-and-tailwind.js

const fs = require('fs');
const path = require('path');

const APP_FILE = path.join(process.cwd(), 'src', 'App.enhanced.js');
const ICONS = ['Shield', 'Gavel', 'BookOpen', 'FileText', 'Users', 'User'];

function ensureFile(p) { if (!fs.existsSync(p)) throw new Error(`File not found: ${p}`); }
function read(p) { return fs.readFileSync(p, 'utf8'); }
function write(p, s) { fs.writeFileSync(p, s, 'utf8'); }
function backup(p) { const b = p + '.bak'; if (!fs.existsSync(b)) fs.copyFileSync(p, b); }

function ensureLucideImports(filePath) {
  ensureFile(filePath);
  const src = read(filePath);

  const importRe = /import\s*\{([^}]*)\}\s*from\s*['"]lucide-react['"];?/;
  const hasAnyUse = ICONS.some((n) => new RegExp(`<${n}(\s|>)`).test(src));
  if (!hasAnyUse) return false;

  let out = src;
  if (importRe.test(src)) {
    out = src.replace(importRe, (m, inner) => {
      const existing = inner.split(',').map((s) => s.trim()).filter(Boolean);
      const names = new Set(existing);
      ICONS.forEach((n) => names.add(n));
      return `import { ${Array.from(names).join(', ')} } from 'lucide-react';`;
    });
  } else {
    const firstImport = src.match(/^(import[^\n]*\n)+/);
    const inject = `import { ${ICONS.join(', ')} } from 'lucide-react';\n`;
    out = firstImport ? src.replace(firstImport[0], firstImport[0] + inject) : inject + src;
  }

  if (out !== src) {
    backup(filePath);
    write(filePath, out);
    console.log(`✔ Updated lucide-react imports in ${path.relative(process.cwd(), filePath)}`);
    return true;
  }
  return false;
}

function findTailwindConfigs(root) {
  const names = ['tailwind.config.js', 'tailwind.config.cjs', 'tailwind.config.mjs', 'tailwind.config.ts'];
  return names.map((n) => path.join(root, n)).filter(fs.existsSync);
}

function stripLineClampPlugin(file) {
  const src = read(file);
  const patterns = [
    /require\(['"]@tailwindcss\/line-clamp['"]\)\s*,?/g,
    /['"]@tailwindcss\/line-clamp['"]\s*,?/g,
  ];
  let out = src;
  patterns.forEach((re) => (out = out.replace(re, '')));
  // Clean up trailing commas in plugins: [ ... , ]
  out = out.replace(/plugins\s*:\s*\[\s*,/g, 'plugins: [');
  out = out.replace(/,\s*\]/g, ']');

  if (out !== src) {
    backup(file);
    write(file, out);
    console.log(`✔ Removed @tailwindcss/line-clamp from ${path.basename(file)}`);
    return true;
  }
  return false;
}

(function main(){
  try {
    ensureLucideImports(APP_FILE);
  } catch (e) {
    console.warn(`⚠ Skipped lucide import fix: ${e.message}`);
  }

  const configs = findTailwindConfigs(process.cwd());
  if (configs.length === 0) {
    console.log('ℹ No tailwind.config.* found. Skipping plugin cleanup.');
  } else {
    configs.forEach(stripLineClampPlugin);
  }
  console.log('Do