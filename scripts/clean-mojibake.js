const fs = require('fs');
const path = require('path');

function fixMojibake(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  const replacements = [
    [/–/g, '–'],
    [/—/g, '—'],
    [/€/g, '€'],
    [/·/g, '·'],
    [/Álava/g, 'Álava'],
    [/Á/g, 'Á'],
    [/á/g, 'á'],
    [/é/g, 'é'],
    [/í/g, 'í'],
    [/ó/g, 'ó'],
    [/ú/g, 'ú'],
    [/ñ/g, 'ñ'],
    [/ü/g, 'ü'],
    [/ç/g, 'ç'],
    [/è/g, 'è'],
    [/ò/g, 'ò'],
    [/À/g, 'À'],
    [/¿/g, '¿'],
    [/¡/g, '¡'],
    [//g, ''],
    ];

  let modified = content;
  for (const [pattern, repl] of replacements) {
    modified = modified.replace(pattern, repl);
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
