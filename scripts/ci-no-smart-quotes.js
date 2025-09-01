// path: scripts/ci-no-smart-quotes.js
// Fails the build if smart quotes or classic mojibake sequences are present under ./src
// Why: Prevents CI from compiling files like: import React from ‘react’
// Usage: add to package.json -> "prebuild": "node scripts/ci-no-smart-quotes.js"

const fs = require('fs');
const path = require('path');

const ROOT = path.join(process.cwd(), 'src');
const exts = new Set(['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.md']);
const SKIP_DIRS = new Set(['node_modules', '.git', 'build', 'dist']);

// Matches true curly quotes, NBSP, stray \u00C2 before Latin-1, and common UTF8->cp1252 triplets
const BAD = /[\u2018\u2019\u201C\u201D\u00A0]|\u00C2(?=[\u00A0-\u00FF])|Â§|â€˜|â€™|â€œ|â€�|â€“|â€”|â€¦/;

function *walk(dir){
  for (const e of fs.readdirSync(dir, { withFileTypes: true })){
    if (SKIP_DIRS.has(e.name)) continue;
    const f = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(f);
    else if (exts.has(path.extname(e.name))) yield f;
  }
}

function main(){
  if (!fs.existsSync(ROOT)) return;
  const offenders = [];
  for (const f of walk(ROOT)){
    const t = fs.readFileSync(f, 'utf8');
    if (BAD.test(t)) offenders.push(f);
  }
  if (offenders.length){
    console.error('\n[ci-no-smart-quotes] Found disallowed characters in:');
    offenders.forEach(p => console.error(' - ' + path.relative(process.cwd(), p)));
    console.error('\nFix: replace curly quotes with ASCII (\'\", `) and remove mojibake like â€˜ â€™ â€œ â€�.');
    process.exit(1);
  }
  console.log('[ci-no-smart-quotes] OK');
}

main();
