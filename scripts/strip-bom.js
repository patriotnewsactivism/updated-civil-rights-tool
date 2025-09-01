// path: scripts/strip-bom.js
// Remove UTF-8 BOM and zero-width no-break space from source files under ./src
// Run automatically in prebuild to keep CRA/ESLint happy in CI.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'src');
const exts = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.json', '.md']);

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'build', 'dist'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (exts.has(path.extname(e.name))) yield p;
  }
}

function stripBom(text) {
  // Leading UTF-8 BOM (\uFEFF) or Windows BOM mis-decoded
  let changed = false;
  let out = text;

  // Remove U+FEFF if at beginning
  if (out.charCodeAt(0) === 0xFEFF) {
    out = out.slice(1);
    changed = true;
  }

  // Remove ZERO-WIDTH NO-BREAK SPACE occurrences within first few chars (sometimes saved into files)
  out = out.replace(/^\uFEFF+/, () => { changed = true; return ''; });

  return { out, changed };
}

(function main(){
  if (!fs.existsSync(ROOT)) return;
  let fixed = 0;
  for (const f of walk(ROOT)) {
    const buf = fs.readFileSync(f);
    const txt = buf.toString('utf8');
    const { out, changed } = stripBom(txt);
    if (changed) {
      if (!fs.existsSync(f + '.bak')) fs.copyFileSync(f, f + '.bak');
      fs.writeFileSync(f, out, 'utf8');
      fixed++;
      console.log('fixed BOM:', path.relative(process.cwd(), f));
    }
  }
  console.log(`[strip-bom] files updated: ${fixed}`);
})();
