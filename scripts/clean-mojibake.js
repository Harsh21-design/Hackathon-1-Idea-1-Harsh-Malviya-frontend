const fs = require('fs');
const path = require('path');

// Dictionary of known mojibake / corrupted UTF-8 sequences and their proper characters
const REPLACEMENTS = [
  ['€', '€'],
  ['·', '·'],
  ['á', 'á'],
  ['é', 'é'],
  ['í', 'í'],
  ['ó', 'ó'],
  ['ú', 'ú'],
  ['ñ', 'ñ'],
  ['À', 'À'],
  ['È', 'È'],
  ['Á', 'Á'],
  ['—', '—'],
  ['–', '–'],
  ['‘', '‘'],
  ['’', '’'],
  ['“', '“'],
  ['”', '”'],
  ['¡', '¡'],
  ['¿', '¿'],
];

function fixMojibake(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = content;

  for (const [bad, good] of REPLACEMENTS) {
    if (modified.includes(bad)) {
      modified = modified.split(bad).join(good);
    }
  }

  if (modified !== content) {
    fs.writeFileSync(filePath, modified, 'utf8');
    console.log('Fixed mojibake in:', filePath);
  }
}

const frontendDir = path.resolve(__dirname, '..');
function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === '.next' || f === '.git') continue;
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (/\.(tsx|ts|js|jsx|json|md)$/.test(f)) {
      fixMojibake(full);
    }
  }
}

walk(frontendDir);
console.log('Finished fixing text encoding across frontend.');
