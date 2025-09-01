// path: scripts/sanitize-source.js
// Purpose: Clean curly quotes and common mojibake from source files, write back as UTF-8.
// Why: Prevents SyntaxError from smart quotes (e.g., “react”) and stray \u00C2 characters.

/* Usage:
   node scripts/sanitize-source.js            # scan ./src, write changes with .bak backups
   node scripts/sanitize-source.js src --dry  # dry run (no writes)
*/

const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'src';
const DRY_RUN = process.argv.includes('--dry');

const VALID_EXTS = new Set(['.js', '.jsx', '.ts', '.tsx', '.json', '.css']);

function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(full);
    } else if (VALID_EXTS.has(path.extname(e.name))) {
      yield full;
    }
  }
}

function sanitizeText(text) {
  let changed = false;

  const before = text;

  // Replace curly quotes with ASCII quotes
  text = text.replace(/[\u2018\u2019]/g, () => {
    changed = true; return "'"; // single quote
  });
  text = text.replace(/[\u201C\u201D]/g, () => {
    changed = true; return '"'; // double quote
  });

  // Convert non-breaking space to regular space
  text = text.replace(/\u00A0/g, () => {
    changed = true; return ' ';
  });

  // Remove stray \u00C2 that often appears before Latin-1 punctuation when UTF-8 got mis-decoded (e.g., "Â§", "Â–")
  text = text.replace(/\u00C2(?=[\u00A0-\u00FF])/g, () => {
    changed = true; return '';
  });

  // Normalize Windows newlines to \n
  text = text.replace(/\r\n?/g, () => {
    changed = true; return '\n';
  });

  return { text, changed, diffHint: changed ? previewDiff(before, text) : '' };
}

function previewDiff(a, b, ctx = 60) {
  // Simple preview: show first location where strings differ
  let i = 0;
  const len = Math.min(a.length, b.length);
  while (i < len && a[i] === b[i]) i++;
  if (i === len && a.length === b.length) return '';
  const start = Math.max(0, i - ctx);
  const endA = Math.min(a.length, i + ctx);
  const endB = Math.min(b.length, i + ctx);
  return `...${JSON.stringify(a.slice(start, endA))}\n=> ...${JSON.stringify(b.slice(start, endB))}`;
}

function ensureBackup(file) {
  const bak = file + '.bak';
  if (fs.existsSync(bak)) return; // don't overwrite existing backup
  fs.copyFileSync(file, bak);
}

function run() {
  const rootAbs = path.resolve(process.cwd(), ROOT);
  if (!fs.existsSync(rootAbs)) {
    console.error(`[sanitize-source] Root path not found: ${rootAbs}`);
    process.exit(1);
  }
  console.log(`[sanitize-source] Scanning: ${rootAbs}${DRY_RUN ? ' (dry run)' : ''}`);

  let total = 0;
  let modified = 0;

  for (const file of walk(rootAbs)) {
    total++;
    const buf = fs.readFileSync(file);
    // Read as UTF-8; even if file is cp1252, Node will decode bytes; we fix mojibake patterns above.
    const text = buf.toString('utf8');
    const { text: out, changed, diffHint } = sanitizeText(text);
    if (changed) {
      modified++;
      if (!DRY_RUN) {
        ensureBackup(file);
        fs.writeFileSync(file, out, { encoding: 'utf8' });
      }
      console.log(`✔ Fixed ${path.relative(process.cwd(), file)}${diffHint ? `\n   ${diffHint}` : ''}`);
    }
  }

  console.log(`[sanitize-source] Files scanned: ${total}, fixed: ${modified}`);
  if (DRY_RUN && modified > 0) {
    console.log('Re-run without --dry to write changes.');
  }
}

run();
