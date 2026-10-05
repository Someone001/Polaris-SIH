const fs = require('fs');
const e = JSON.parse(fs.readFileSync('src/data/expeditions.json', 'utf8')).expeditions;
const i = JSON.parse(fs.readFileSync('src/data/items.json', 'utf8')).items;
const l = JSON.parse(fs.readFileSync('research/sources-ledger.json', 'utf8'));
console.log('--- APP DATA ---');
for (const r of [...e, ...i]) {
  console.log([r.id, r.type || 'expedition', r.title || r.name, r.sourceUrl || '', r.doi || r.videoUrl || r.fileUrl || ''].join(' | '));
}
console.log('--- LEDGER ---');
for (const r of l) {
  console.log([r.id, r.type, r.fields.title || r.fields.name, r.sources[0].url].join(' | '));
}
