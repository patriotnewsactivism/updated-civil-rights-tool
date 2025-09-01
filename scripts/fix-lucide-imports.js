// path: scripts/fix-lucide-imports.js
// Scan ./src for lucide-react icon usages and ensure proper named imports exist.
// Conservative: only inject for a curated allowlist of lucide icon names.
// Run: node scripts/fix-lucide-imports.js

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');
const exts = new Set(['.js', '.jsx', '.ts', '.tsx']);

// Expand as needed
const ICON_ALLOWLIST = new Set([
  'User','Users','Shield','Gavel','BookOpen','FileText','Search','Settings','AlertTriangle','CheckCircle2','XCircle','Home','LogIn','LogOut','Download','Upload','ArrowRight','ArrowLeft','ChevronDown','ChevronUp','Menu','Bell','Calendar','Clock','MapPin','Mail','Phone','Link','Share2','Copy','Edit','Trash2'
]);

function* walk(dir){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if (e.name === 'node_modules' || e.name === '.git' || e.name === 'build' || e.name === 'dist') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function read(p){ return fs.readFileSync(p,'utf8'); }
function write(p,s){ fs.writeFileSync(p,s,'utf8'); }
function backup(p){ const bak=p+'.bak'; if(!fs.existsSync(bak)) fs.copyFileSync(p,bak); }

function parseLucideImports(src){
  // capture all import { ... } from 'lucide-react'
  const re = /import\s*\{([^}]*)\}\s*from\s*['"]lucide-react['"];?/g;
  const matches = [...src.matchAll(re)];
  const imports = new Set();
  for(const m of matches){
    const inner = m[1];
    inner.split(',').map(s=>s.trim()).filter(Boolean).forEach(tok=>{
      // strip aliasing: Icon as Alias
      const base = tok.split(/\s+as\s+/i)[0].trim();
      if (base) imports.add(base);
    });
  }
  return { imports, matches };
}

function usedIcons(src){
  const re = /<([A-Z][A-Za-z0-9_]*)\b/g;
  const uses = new Set();
  let m;
  while((m=re.exec(src))){
    const name = m[1];
    if (ICON_ALLOWLIST.has(name)) uses.add(name);
  }
  return uses;
}

function injectOrAugment(file){
  const src = read(file);
  // quick opt-out
  if (/\/\/\s*lucide-skip/.test(src)) return false;

  const { imports, matches } = parseLucideImports(src);
  const uses = usedIcons(src);
  if (uses.size === 0) return false;

  const missing = [...uses].filter(n=>!imports.has(n));
  if (missing.length === 0 && matches.length <= 1) return false;

  let out = src;

  if (matches.length === 0) {
    // Insert new import after the last existing import block at the top
    const topImports = out.match(/^(?:import[^\n]*\n)+/);
    const inject = `import { ${[...uses].sort().join(', ')} } from 'lucide-react';\n`;
    out = topImports ? out.replace(topImports[0], topImports[0] + inject) : inject + out;
  } else {
    // Merge all lucide imports into the first one
    const first = matches[0];
    const start = first.index;
    const end = start + first[0].length;

    const union = new Set([...imports, ...uses]);
    const merged = `import { ${[...union].sort().join(', ')} } from 'lucide-react';`;

    // Remove subsequent lucide imports
    out = out.replace(/import\s*\{[^}]*\}\s*from\s*['"]lucide-react['"];?\s*/g, '');
    // Reinsert the merged at the original first import position
    out = out.slice(0, start) + merged + '\n' + out.slice(start);
  }

  if (out !== src) {
    backup(file);
    write(file, out);
    console.log('✔ fixed', path.relative(ROOT, file));
    return true;
  }
  return false;
}

(function main(){
  let changed = 0;
  for (const f of walk(SRC_DIR)) {
    if (!exts.has(path.extname(f))) continue;
    try { if (injectOrAugment(f)) changed++; } catch(e) { console.warn('skip', f, e.message); }
  }
  console.log(`[fix-lucide-imports] files updated: ${changed}`)