const fs = require('fs');
const path = require('path');

const ledger = JSON.parse(fs.readFileSync(path.join(__dirname, 'sources-ledger.json'), 'utf8'));
const ledgerDOIs = new Set();
ledger.forEach(l => {
  const doi = l.fields?.doi || l.doi;
  if (doi) ledgerDOIs.add(doi.toLowerCase().trim());
});

const filesToScan = [];
function gatherFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name !== 'node_modules' && ent.name !== 'dist' && ent.name !== '.git') {
        gatherFiles(full);
      }
    } else if (/\.(js|jsx|json|html|md)$/.test(ent.name)) {
      filesToScan.push(full);
    }
  }
}
const rootDir = path.join(__dirname, '..');
['src'].forEach(d => gatherFiles(path.join(rootDir, d)));
filesToScan.push(path.join(rootDir, 'README.md'));

console.log(`Checking DOI occurrences across ${filesToScan.length} files...`);

const doiRegex = /(?:https?:\/\/doi\.org\/|10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+)/gi;
const foundDOIs = new Map();

filesToScan.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = doiRegex.exec(content)) !== null) {
    let raw = m[0];
    let clean = raw.replace(/^https?:\/\/doi\.org\//i, '').replace(/[),.]+$/, '').toLowerCase().trim();
    if (!clean || clean.startsWith('$') || clean.includes('{')) continue;
    if (!foundDOIs.has(clean)) {
      foundDOIs.set(clean, []);
    }
    foundDOIs.get(clean).push(path.relative(rootDir, f));
  }
});

let unapproved = 0;
for (const [doi, files] of foundDOIs.entries()) {
  const isApproved = ledgerDOIs.has(doi);
  if (!isApproved) {
    unapproved++;
    console.error(`UNAPPROVED DOI: ${doi} in files: ${files.join(', ')}`);
  }
}

if (unapproved === 0) {
  console.log(`PASS: All ${foundDOIs.size} distinct DOIs found in the codebase are present in the ledger!`);
} else {
  console.error(`FAIL: ${unapproved} unapproved DOIs found.`);
  process.exit(1);
}
