// path: scripts/ci-no-merge-markers.js
// Fail build if git merge conflict markers are present under ./src
// Add to package.json:  "prebuild": "node scripts/ci-no-smart-quotes.js && node scripts/ci-no-merge-markers.js"

const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'src');
const exts = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.json', '.md']);
const MARKER = /^(<<<<<<<|=======|>>>>>>>)/m;

function *walk(dir){
  for (const e of fs.readdirSync(dir, {withFileTypes:true})){
    if (['node_modules','.git','build','dist'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (exts.has(path.extname(e.name))) yield p;
  }
}

const offenders = [];
for (const f of walk(ROOT)){
  const t = fs.readFileSync(f,'utf8');
  if (MARKER.test(t)) offenders.push(f);
}

if (offenders.length){
  console.error('\n[ci-no-merge-markers] Found conflict markers in:');
  offenders.forEach(f => console.error(' - ' + path.relative(process.cwd(), f)));
  console.error('\nResolve merges before building: delete lines starting with <<<<<<<, =======, >>>>>>>.');
  process.exit(1);
}
console.log('[ci-no-merge-markers] OK');
