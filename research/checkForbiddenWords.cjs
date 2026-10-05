const fs = require('fs');
const path = require('path');

const targetWords = ['official', 'verified', 'certified', 'authentic', 'government provenance', 'Official Sources'];

const filesToScan = [];
function gatherFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name !== 'node_modules' && ent.name !== 'dist' && ent.name !== '.git') {
        gatherFiles(full);
      }
    } else if (/\.(js|jsx|json|html|md|css)$/.test(ent.name)) {
      filesToScan.push(full);
    }
  }
}

const rootDir = path.join(__dirname, '..');
['src'].forEach(d => gatherFiles(path.join(rootDir, d)));
filesToScan.push(path.join(rootDir, 'index.html'));
filesToScan.push(path.join(rootDir, 'README.md'));

console.log(`Scanning ${filesToScan.length} files for forbidden words...`);

const wordCounts = {};
targetWords.forEach(w => wordCounts[w] = 0);
const wordMatches = [];

filesToScan.forEach(file => {
  const relPath = path.relative(rootDir, file);
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    targetWords.forEach(w => {
      const regex = new RegExp(`\\b${w}\\b`, 'gi');
      let m;
      while ((m = regex.exec(line)) !== null) {
        wordCounts[w]++;
        wordMatches.push({
          word: w,
          file: relPath,
          line: idx + 1,
          content: line.trim()
        });
      }
    });
  });
});

console.log('\n--- WORD COUNTS ---');
console.log(JSON.stringify(wordCounts, null, 2));

if (wordMatches.length > 0) {
  console.log('\n--- MATCH DETAILS ---');
  wordMatches.forEach(m => {
    console.log(`[${m.word}] ${m.file}:${m.line} -> "${m.content}"`);
  });
} else {
  console.log('\nZERO occurrences of forbidden words found!');
}
